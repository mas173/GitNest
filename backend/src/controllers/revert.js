import path from 'path';
import fs from 'fs';
import simpleGit from 'simple-git';

import Repository from '../models/Repository.model.js';

import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';
import { sendSuccess } from '../utils/responseHandlers.js';

export const revertCommit = asyncHandler(async (req, res, next) => {
  const { repoName, commitHash } = req.body;
  if (!repoName || !commitHash) {
    return next(
      new AppError('Repository name and commit hash are required', 400)
    );
  }

  const repository = await Repository.findOne({
    owner: req.user.id,
    name: repoName,
  });
  if (!repository) {
    return next(new AppError('Repository not found', 404));
  }

  const repoPath = path.resolve(
    'repositories',
    req.user.id,
    repository.name
  );
  if (!fs.existsSync(repoPath)) {
    return next(new AppError('Repository directory not found', 404));
  }

  const git = simpleGit(repoPath);

  await git.revert(commitHash);
  sendSuccess(
    res,
    200,
    {
      commitHash,
    },
    'Commit reverted successfully'
  );
});