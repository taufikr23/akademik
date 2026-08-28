INSERT INTO roles (name, description) VALUES
('ADMIN', 'Administrator sistem'),
('GURU', 'Guru pengajar'),
('SISWA', 'Siswa/i sekolah')
ON DUPLICATE KEY UPDATE name = name;