import mongoose from 'mongoose';
import Repository from '../models/Repository.model.js';
import User from '../models/User.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';
import { sendSuccess } from '../utils/responseHandlers.js';
import { logActivitySafely } from '../utils/logActivitySafely.js';
import ACTIVITY_TYPES from '../constants/activityTypes.js';

export const createRepository = asyncHandler(async (req, res, next)=> {
    const { name, description, visibility, language, topics } = req.body;

    if(!name) {
        return next(new AppError('Repository name is required', 400));
    }

    const existingRepo = await Repository.findOne({
        owner: req.user.id,
        name,
    });

    if (existingRepo) {
        return next(
            new AppError('You already have a repository with this name', 400)
        );
    }

    const repository = await Repository.create({
        name,
        owner: req.user.id,
        description,
        visibility,
        language,
        topics,
    });

    await logActivitySafely({
        actor: req.user.id,
        type: ACTIVITY_TYPES.REPOSITORY_CREATED,
        repository: repository._id,
        metadata: {
            repoName: repository.name,
            visibility: repository.visibility,
        },
    });

    sendSuccess(res, 201, repository, 'Repository created successfully');
});

export const getRepository = asyncHandler(async (req, res, next) => {
    const { username, reponame } = req.params;

    const repository = await Repository.findOne({ name: reponame})
    .populate('owner', 'username avatarUrl bio');

    if(!repository) {
        return next(new AppError('Repository not found', 404));
    }

    if(
        repository.visibility === 'private' &&
        repository.owner._id.toString() !== req.user?.id
    ) {
        return next(new AppError('Repository not found', 404));
    }

    sendSuccess(res, 200, repository);
});

export const getUserRepositories = asyncHandler(async (req, res, next) => {
    const { username } = req.params;

    const repositories = await Repository.find()
    .populate({
        path: 'owner',
        match: { username },
        select: 'username avatarUrl',
    })
    .then((repos) => repos.filter((r) => r.owner !== null));

    const filtered = repositories.filter((r) => {
        if(r.visibility === 'public') return true;
        if(req.user && r.owner._id.toString() === req.user.id) return true;
        return false;
    });

    sendSuccess(res, 200, filtered);
});

export const updateRepository = asyncHandler(async(req, res, next) => {
    const { username, reponame } = req.params;

    const repository = await Repository.findOne({
        name: reponame,
        owner: req.user.id,
    });

    if(!repository) {
        return next(new AppError('Repository not found', 404));
    }

    const { description, visibility, language, topics, defaultBranch } =
    req.body;

    repository.description = description ?? repository.description;
    repository.visibility = visibility ?? repository.visibility;
    repository.language = language ?? repository.language;
    repository.topics = topics ?? repository.topics;
    repository.defaultBranch = defaultBranch ?? repository.defaultBranch;

    await repository.save();

    sendSuccess(res, 200, repository, 'Repository updated successfully');
});

export const deleteRepository = asyncHandler(async (req, res, next) => {
    const { reponame } = req.params;

    const repository = await Repository.findOne({
        name: reponame,
        owner: req.user.id,
    });

    if(!repository) {
        return next(new AppError('Repository not found', 404));
    }

    await repository.deleteOne();

    sendSuccess(res, 200, null, 'Repository deleted successfully');
});

export const starRepository = asyncHandler(async (req, res, next) => {
    const { username, reponame } = req.params;

    const owner = await User.findOne({ username: username.toLowerCase() }).select('_id');
    if (!owner) {
        return next(new AppError('Repository not found', 404));
    }

    const repo = await Repository.findOne({ name: reponame, owner: owner._id });
    if (!repo) {
        return next(new AppError('Repository not found', 404));
    }

    const isCurrentlyStarred = await Repository.findOne(
        { _id: repo._id, stars: req.user._id },
        { _id: 1 }
    );

    let updated;
    if (isCurrentlyStarred) {
        updated = await Repository.findByIdAndUpdate(
            repo._id,
            { $pull: { stars: req.user._id } },
            { new: true, fields: { stars: 1 } }
        );
    } else {
        updated = await Repository.findOneAndUpdate(
            { _id: repo._id, stars: { $ne: req.user._id } },
            { $addToSet: { stars: req.user._id } },
            { new: true, fields: { stars: 1 } }
        );
    }

    if (!updated) {
        return next(new AppError('Repository not found', 404));
    }

    if (updated && !isCurrentlyStarred) {
        await logActivitySafely({
            actor: req.user.id,
            type: ACTIVITY_TYPES.REPOSITORY_STARRED,
            repository: repo._id,
            metadata: { repoName: repo.name },
        });
    }

    const message = isCurrentlyStarred
        ? 'Repository unstarred successfully'
        : 'Repository starred successfully';

    sendSuccess(res, 200, { stars: updated.stars.length }, message);
});

export const forkRepository = asyncHandler(async (req, res, next) => {
    const { username, reponame } = req.params;

    const owner = await User.findOne({ username: username.toLowerCase() }).select('_id');
    if (!owner) {
        return next(new AppError('Repository not found', 404));
    }

    const session = await mongoose.startSession();
    let forked;
    try {
        session.startTransaction({
            readConcern: { level: 'snapshot' },
            writeConcern: { w: 'majority' },
        });

        const original = await Repository.findOne({
            name: reponame,
            owner: owner._id,
        }).session(session);

        if (!original) {
            await session.abortTransaction();
            return next(new AppError('Repository not found', 404));
        }

        if (original.owner.toString() === req.user.id) {
            await session.abortTransaction();
            return next(new AppError('You cannot fork your own repository', 400));
        }

        const existing = await Repository.findOne({
            name: original.name,
            owner: req.user._id,
            forkedFrom: original._id,
        }).session(session);

        if (existing) {
            await session.abortTransaction();
            return next(new AppError('You have already forked this repository', 400));
        }

        [forked] = await Repository.create([{
            name: original.name,
            owner: req.user._id,
            description: original.description,
            visibility: original.visibility,
            language: original.language,
            topics: original.topics,
            defaultBranch: original.defaultBranch,
            forkedFrom: original._id,
        }], { session });

        const parentUpdate = await Repository.updateOne(
            { _id: original._id },
            { $addToSet: { forks: forked._id } },
            { session }
        );

        if (parentUpdate.modifiedCount === 0) {
            await session.abortTransaction();
            return next(new AppError('Fork conflict — please retry', 409));
        }

        await session.commitTransaction();
        sendSuccess(res, 201, forked, 'Repository forked successfully');
    } catch (error) {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        if (error.code === 11000) {
            return next(new AppError('You have already forked this repository', 400));
        }
        if (error.errorLabels?.includes('TransientTransactionError')) {
            return next(new AppError('Fork conflict — please retry', 409));
        }
        return next(new AppError('Fork operation failed', 500));
    } finally {
        session.endSession();
    }
});