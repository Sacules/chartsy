package models

import (
	"time"

	"github.com/jmoiron/sqlx"
)

type Verification struct {
	Email     string
	Code      string
	ExpiresAt time.Time
}

type VerificationModel struct {
	DB *sqlx.DB
}

func (v *VerificationModel) Insert(email, code string) error {
	stmt := `INSERT INTO verifications (email, code, expires_at) VALUES (?, ?, ?)`
	expiresAt := time.Now().Add(24 * time.Hour)

	_, err := v.DB.Exec(stmt, email, code, expiresAt)

	return err
}
