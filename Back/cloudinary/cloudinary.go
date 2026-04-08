package cloudinary

import (
	"context"
	"fmt"
	"io"
	"strings"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
)

type Service struct {
	Cld *cloudinary.Cloudinary
}

func New(cloudName, apiKey, apiSecret string) (*Service, error) {
	cld, err := cloudinary.NewFromParams(cloudName, apiKey, apiSecret)
	if err != nil {
		return nil, fmt.Errorf("Cloudinary init failed: %w", err)
	}
	return &Service{Cld: cld}, nil
}

func (s *Service) UploadAvatar(ctx context.Context, file io.Reader, userID string) (string, error) {
	overwrite := true 
	result, err := s.Cld.Upload.Upload(ctx, file, uploader.UploadParams{
		PublicID:       "user_" + userID,
		Folder:         "user_avatars",
		Transformation: "c_thumb,g_face,w_200,h_200,r_max",
		Overwrite:      &overwrite, 
	})
	if err != nil {
		return "", fmt.Errorf("upload failed: %w", err)
	}
	return result.SecureURL, nil
}

func ExtractPublicID(avatarURL string) string {
	if avatarURL == "" {
		return ""
	}
	parts := strings.Split(avatarURL, "/")
	if len(parts) < 2 {
		return ""
	}
	lastPart := parts[len(parts)-1]
	return strings.Split(lastPart, ".")[0]
}
