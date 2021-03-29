/*
  Warnings:

  - Added the required column `password` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `classes` ADD COLUMN     `status` ENUM('PREPARE', 'STUDYING', 'FINISHED') NOT NULL DEFAULT 'PREPARE';

-- AlterTable
ALTER TABLE `users` ADD COLUMN     `password` VARCHAR(191) NOT NULL;
