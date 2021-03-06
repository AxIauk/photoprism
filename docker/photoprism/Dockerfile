FROM photoprism/development:20210117 as build

# Set up project directory
WORKDIR "/go/src/github.com/photoprism/photoprism"
COPY . .

# Build PhotoPrism
RUN make dep build-js install

# Same base image as photoprism/development
FROM ubuntu:20.04

# Set environment variables
ENV DEBIAN_FRONTEND noninteractive

# Configure apt-get
RUN echo 'Acquire::Retries "10";' > /etc/apt/apt.conf.d/80retry && \
    echo 'APT::Install-Recommends "false";' > /etc/apt/apt.conf.d/80recommends && \
    echo 'APT::Install-Suggests "false";' > /etc/apt/apt.conf.d/80suggests && \
    echo 'APT::Get::Assume-Yes "true";' > /etc/apt/apt.conf.d/80forceyes && \
    echo 'APT::Get::Fix-Missing "true";' > /etc/apt/apt.conf.d/80fixmissin

# Install additional distribution packages
RUN apt-get update && apt-get install -y --no-install-recommends \
        wget \
        ca-certificates \
        mariadb-client \
        sqlite3 \
        tzdata \
        libheif-examples \
        gnupg \
        gpg-agent \
        apt-utils \
        add-apt-key \
        exiftool \
        rawtherapee \
        ffmpeg

# Copy dependencies
COPY --from=build /go/bin/gosu /bin/gosu
COPY --from=build /usr/lib/libtensorflow.so /usr/lib/libtensorflow.so
COPY --from=build /usr/lib/libtensorflow_framework.so /usr/lib/libtensorflow_framework.so
RUN ldconfig

# Install RAW to JPEG converter
RUN sh -c "echo 'deb http://download.opensuse.org/repositories/home:/pmdpalma:/Ubuntu:/20.04:/bucket/xUbuntu_20.04/ /' > /etc/apt/sources.list.d/home:pmdpalma:Ubuntu:20.04:bucket.list" && \
    wget -qO - https://download.opensuse.org/repositories/home:pmdpalma:Ubuntu:20.04:bucket/xUbuntu_20.04/Release.key | apt-key add - && \
    apt-get update && \
    apt-get install darktable && \
    apt-get upgrade && \
    apt-get dist-upgrade && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set default umask and create photoprism user
RUN umask 0000 && useradd photoprism -m -d /photoprism
WORKDIR /photoprism

ENV TF_CPP_MIN_LOG_LEVEL 2

ENV PATH /photoprism/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
ENV TMPDIR /tmp

# Storage path names
ENV PHOTOPRISM_ASSETS_PATH /photoprism/assets
ENV PHOTOPRISM_STORAGE_PATH /photoprism/storage
ENV PHOTOPRISM_BACKUP_PATH /var/lib/photoprism
ENV PHOTOPRISM_ORIGINALS_PATH /photoprism/originals
ENV PHOTOPRISM_IMPORT_PATH /photoprism/import
ENV PHOTOPRISM_LOG_FILENAME /photoprism/photoprism.log
ENV PHOTOPRISM_PID_FILENAME /photoprism/photoprism.pid

# Defaults for common config values
# See https://docs.photoprism.org/getting-started/config-options/
ENV PHOTOPRISM_DEBUG "false"
ENV PHOTOPRISM_PUBLIC "false"
ENV PHOTOPRISM_READONLY "false"
ENV PHOTOPRISM_UPLOAD_NSFW "true"
ENV PHOTOPRISM_DETECT_NSFW "false"
ENV PHOTOPRISM_EXPERIMENTAL "false"
ENV PHOTOPRISM_SITE_URL "http://localhost:2342/"
ENV PHOTOPRISM_SITE_TITLE "PhotoPrism"
ENV PHOTOPRISM_SITE_CAPTION "Browse Your Life"
ENV PHOTOPRISM_SITE_DESCRIPTION ""
ENV PHOTOPRISM_SITE_AUTHOR ""
ENV PHOTOPRISM_HTTP_HOST "0.0.0.0"
ENV PHOTOPRISM_HTTP_PORT 2342
ENV PHOTOPRISM_DATABASE_DRIVER "sqlite"
ENV PHOTOPRISM_DATABASE_SERVER ""
ENV PHOTOPRISM_DATABASE_NAME "photoprism"
ENV PHOTOPRISM_DATABASE_USER "photoprism"
ENV PHOTOPRISM_DATABASE_PASSWORD ""
ENV PHOTOPRISM_DISABLE_WEBDAV "false"
ENV PHOTOPRISM_DISABLE_SETTINGS "false"
ENV PHOTOPRISM_DISABLE_BACKUPS "false"
ENV PHOTOPRISM_DISABLE_EXIFTOOL "false"
ENV PHOTOPRISM_DISABLE_PLACES "false"
ENV PHOTOPRISM_DISABLE_TENSORFLOW "false"
ENV PHOTOPRISM_DARKTABLE_PRESETS "false"
ENV PHOTOPRISM_THUMB_FILTER "lanczos"
ENV PHOTOPRISM_THUMB_UNCACHED "false"
ENV PHOTOPRISM_THUMB_SIZE 2048
ENV PHOTOPRISM_THUMB_SIZE_UNCACHED 7680
ENV PHOTOPRISM_JPEG_SIZE 7680
ENV PHOTOPRISM_JPEG_QUALITY 92
ENV PHOTOPRISM_WORKERS 0
ENV PHOTOPRISM_WAKEUP_INTERVAL 900
ENV PHOTOPRISM_AUTO_INDEX 300
ENV PHOTOPRISM_AUTO_IMPORT 300

# Copy files to /photoprism
COPY --from=build /root/.local/bin/photoprism /photoprism/bin/photoprism
COPY --from=build /root/.photoprism/assets /photoprism/assets

# Create directories
RUN mkdir -p \
    /var/lib/photoprism \
    /tmp/photoprism \
    /photoprism/originals \
    /photoprism/import \
    /photoprism/storage/config \
    /photoprism/storage/cache && \
    chown -Rf photoprism:photoprism /photoprism /var/lib/photoprism /tmp/photoprism && \
    chmod -Rf a+rw /photoprism /var/lib/photoprism /tmp/photoprism

# Show photoprism version
RUN photoprism -v

# Expose http port
EXPOSE 2342

# Configure entrypoint
COPY --chown=root:root /docker/entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
VOLUME /var/lib/photoprism

# Run server
CMD ["photoprism", "start"]
