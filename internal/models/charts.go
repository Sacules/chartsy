package models

import (
	"database/sql"
	"image/color"
	"time"
)

type ImagesTextPlacement string

const (
	ImagesTextHide   ImagesTextPlacement = "hide"
	ImagesTextInline ImagesTextPlacement = "inline"
	ImagesTextLeft   ImagesTextPlacement = "left"
	ImagesTextRight  ImagesTextPlacement = "right"
	ImagesTextBelow  ImagesTextPlacement = "below"
)

type ImageShape string

const (
	ImageShapeSquare   = "square"
	ImageShapePortrait = "portrait"
)

type ChartSetting struct {
	Title       string
	ColumnCount uint8
	RowCount    uint8
	Spacing     uint8
	Margin      uint8
	ImageHeight uint8
	ImageShape  ImageShape
	BgColor     color.RGBA
	TextColor   color.RGBA

	ImagesTextPlacement ImagesTextPlacement
}

type Chart struct {
	ID      int
	Images  []Image
	Setting ChartSetting

	Created time.Time
	Updated time.Time
}

type ChartModel struct {
	DB *sql.DB
}

func (m *ChartModel) Insert() (int, error) {
	query := `INSERT INTO charts (updated, created) VALUES (
		UTC_TIMESTAMP(),
		UTC_TIMESTAMP()
	)`

	result, err := m.DB.Exec(query)
	if err != nil {
		return 0, err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}

	return int(id), nil
}

func (m *ChartModel) Get(id int) (*Chart, error) {
	return nil, nil
}

func (m *ChartModel) Latest() ([]*Chart, error) {
	return nil, nil
}