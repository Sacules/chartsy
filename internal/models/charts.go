package models

import (
	"database/sql"
	"errors"
	"time"
)

// Image represents the core of a chart, whether
// it is an Album, or a Movie, a Game, etc.
type Image struct {
	Title   string
	Caption string
	URL     string
}

type ImagesTextPlacement string

const (
	ImagesTextHide    ImagesTextPlacement = "hide"
	ImagesTextInline  ImagesTextPlacement = "inline"
	ImagesTextLeft    ImagesTextPlacement = "left"
	ImagesTextRight   ImagesTextPlacement = "right"
	ImagesTextBelow   ImagesTextPlacement = "below"
	ImagesTextOverlay ImagesTextPlacement = "overlay"
)

type ImagesShape string

const (
	ImageShapeSquare   = "square"
	ImageShapePortrait = "portrait"
)

type Chart struct {
	ID      int
	Created time.Time
	Updated time.Time

	Images      []Image
	Title       string
	ColumnCount uint8
	RowCount    uint8
	Spacing     uint8
	Padding     uint8
	BgColor     string
	TextColor   string

	ImagesHeight         uint8
	ImagesShape          ImagesShape
	ImagesTextPlacement  ImagesTextPlacement
	ImagesRoundedCorners bool
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
		id, created, updated, title, column_count, row_count, spacing, padding, images_shape, images_height, images_rounded_corners, bg_color, text_color, images_text_placement
		FROM charts
		WHERE id = ?`

	row := m.DB.QueryRow(query, id)

	c := &Chart{}

	err := row.Scan(&c.ID, &c.Created, &c.Updated, &c.Title, &c.ColumnCount, &c.RowCount, &c.Spacing, &c.Padding, &c.ImagesShape, &c.ImagesHeight, &c.ImagesRoundedCorners, &c.BgColor, &c.TextColor, &c.ImagesTextPlacement)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrNoRecord
		}

		return nil, err
	}

	query = `SELECT imgs.url, imgs.title, imgs.caption
		FROM images imgs
		INNER JOIN charts_images ci
		ON ci.chart_id = ? AND imgs.url = ci.image_url
		ORDER BY ci.image_position ASC`

	rows, err := m.DB.Query(query, id)
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	images := []Image{}

	for rows.Next() {
		img := Image{}

		err = rows.Scan(&img.URL, &img.Title, &img.Caption)
		if err != nil {
			return nil, err
		}

		images = append(images, img)
	}

	c.Images = images

	return c, nil
}

func (m *ChartModel) Latest() ([]*Chart, error) {
	return nil, nil
}

func (m *ChartModel) Update(id int, title string, columns, rows, spacing, padding, imgsHeight uint8) error {
	query := `UPDATE charts
		SET title = ?, column_count = ?, row_count = ?,
			spacing = ?, padding = ?, images_height = ?
		WHERE id = ?`

	_, err := m.DB.Exec(query, title, columns, rows, spacing, padding, imgsHeight, id)

	return err
}
