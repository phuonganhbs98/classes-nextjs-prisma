-- AlterTable
ALTER TABLE `users` ADD COLUMN     `date_birth` DATETIME(3),
    ADD COLUMN     `gender` ENUM('MALE', 'FEMALE', 'OTHER'),
    ADD COLUMN     `phone_number` VARCHAR(191);
