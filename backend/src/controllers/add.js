import path from 'path';
import fs from 'fs';
import simpleGit from 'simple-git';

import Repository from '../models/Repository.model.js';

import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';
import { sendSuccess } from '../utils/responseHandlers.js';

export const addFiles = asyncHandler(async (req, res, next) => {
  const { repoName, files = ['.'] } = req.body;

  if (!repoName) {
    return next(new AppError('Repository name is required', 400));
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

  if (!fs.existsSync(path.join(repoPath, '.git'))) {
    return next(new AppError('Invalid Git repository', 400));
  }

  const git = simpleGit(repoPath);

  await git.add(files);

  sendSuccess(
    res,
    200,
    {
      repository: repository.name,
      files,
    },
    'Files staged successfully'
  );
});
