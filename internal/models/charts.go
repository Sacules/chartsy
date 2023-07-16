package models

import (
	"database/sql"
	"errors"
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

type Chart struct {
	ID      int
	Created time.Time
	Updated time.Time

	Images              []Image
	Title               string
	ColumnCount         uint8
	RowCount            uint8
	Spacing             uint8
	Margins             uint8
	ImageHeight         uint8
	ImageShape          ImageShape
	BgColor             string
	TextColor           string
	ImagesTextPlacement ImagesTextPlacement
}

type ChartModel struct {
	DB *sql.DB
}

func (m *ChartModel) Insert() (int, error) {
	query := `INSERT INTO charts (title) VALUES (DEFAULT)`

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
	query := `SELECT
		id, created, updated, title, column_count, row_count, spacing, margin, image_shape, image_height, bg_color, text_color, images_text_placement
		FROM charts
		WHERE id = ?`

	row := m.DB.QueryRow(query, id)

	c := &Chart{}

	err := row.Scan(&c.ID, &c.Created, &c.Updated, &c.Title, &c.ColumnCount, &c.RowCount, &c.Spacing, &c.Margins, &c.ImageShape, &c.ImageHeight, &c.BgColor, &c.TextColor, &c.ImagesTextPlacement)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrNoRecord
		}

		return nil, err
	}

	return c, nil
}

func (m *ChartModel) Latest() ([]*Chart, error) {
	return nil, nil
}
