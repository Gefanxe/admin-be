-- CreateTable
CREATE TABLE `admin_user` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(20) NOT NULL,
    `password` VARCHAR(64) NOT NULL,
    `salt` VARCHAR(8) NOT NULL,
    `name` VARCHAR(50),
    `introduction` VARCHAR(255),
    `avatar` VARCHAR(255),
    `email` VARCHAR(255),
    `last_login_ip` VARCHAR(20),
    `del` BIT(1) NOT NULL DEFAULT b'0',
    `created_date` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_data` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `admin_user.username_unique`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `casbin_rule` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `ptype` VARCHAR(255) NOT NULL,
    `v0` VARCHAR(255),
    `v1` VARCHAR(255),
    `v2` VARCHAR(255),
    `v3` VARCHAR(255),
    `v4` VARCHAR(255),
    `v5` VARCHAR(255),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
