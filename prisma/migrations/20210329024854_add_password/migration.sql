/*
  Warnings:

  - Made the column `email` on table `users` required. The migration will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `email` VARCHAR(191) NOT NULL;
