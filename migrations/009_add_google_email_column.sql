-- Idempotent column addition for google_oauth_tokens
-- This procedure checks if the column exists before attempting to add it
DROP PROCEDURE IF EXISTS AddGoogleEmailColumn;
DELIMITER //
CREATE PROCEDURE AddGoogleEmailColumn()
BEGIN
    IF NOT EXISTS (
        SELECT * FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_NAME = 'google_oauth_tokens' AND COLUMN_NAME = 'google_email' AND TABLE_SCHEMA = DATABASE()
    ) THEN
        ALTER TABLE google_oauth_tokens ADD COLUMN google_email VARCHAR(255) NOT NULL DEFAULT '' AFTER user_id;
        ALTER TABLE google_oauth_tokens ADD INDEX idx_google_email (google_email);
    END IF;
END //
DELIMITER ;
CALL AddGoogleEmailColumn();
DROP PROCEDURE AddGoogleEmailColumn;
