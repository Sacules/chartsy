package models

import (
	"database/sql"
	"errors"
	"os"
	"time"

	"github.com/jmoiron/sqlx"
)

// Image represents the core of a chart, whether
// it is an Album, or a Movie, a Game, etc.
type Image struct {
	Title   string `json:"title"`
	Caption string `json:"caption"`
	URL     string `json:"url"`
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
	ID      int       `db:"rowid"`
	Created time.Time `db:"created"`
	Updated time.Time `db:"updated"`

	Images      []Image `db:"-"`
	Title       string  `db:"title"`
	ColumnCount uint8   `db:"column_count"`
	RowCount    uint8   `db:"row_count"`
	Spacing     uint8   `db:"spacing"`
	Padding     uint8   `db:"padding"`
	BgColor     string  `db:"bg_color"`
	TextColor   string  `db:"text_color"`

	ImagesWidth         uint8               `db:"images_width"`
	ImagesShape         ImagesShape         `db:"images_shape"`
	ImagesTextPlacement ImagesTextPlacement `db:"images_text_placement"`
}

type ChartModel struct {
	DB *sqlx.DB
}

func (m *ChartModel) Insert() (int, error) {
	query := `INSERT INTO charts (title) VALUES ('Untitled chart')`

	result, err := m.DB.Exec(query)
	if err != nil {
		return 0, err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}

	content, err := os.ReadFile("newchart.sql")
	if err != nil {
		return 0, err
	}

	ids := make([]int64, 100)
	for i := 0; i < len(ids); i++ {
		ids[i] = id
	}

	m.DB.Exec(string(content), ids)

	return int(id), nil
}

func (m *ChartModel) Get(id int) (*Chart, error) {
	query := `SELECT
		rowid, created, updated, title, column_count, row_count, spacing, padding, images_shape, images_width, bg_color, text_color, images_text_placement
		FROM charts
		WHERE rowid = ?`

	c := Chart{}
	err := m.DB.Get(&c, query, id)

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

	images := []Image{}

	err = m.DB.Select(&images, query, c.ID)

	c.Images = images

	return &c, nil
}

func (m *ChartModel) Latest() ([]*Chart, error) {
	return nil, nil
}

func (m *ChartModel) Update(id int, title string, columns, rows, spacing, padding, imgsWidth uint8) error {
	query := `UPDATE charts
		SET title = ?, column_count = ?, row_count = ?,
			spacing = ?, padding = ?, images_width = ?
		WHERE rowid = ?`

	_, err := m.DB.Exec(query, title, columns, rows, spacing, padding, imgsWidth, id)

	return err
}
