/*
  Warnings:

  - Added the required column `dayInWeek` to the `schedules` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `schedules` ADD COLUMN     `dayInWeek` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `password` VARCHAR(191);
