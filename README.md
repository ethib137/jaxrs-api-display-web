# Liferay API Display

View and execute calls for Liferay's JAX-RS APIs.

This is a simple hacked together project, that still has lots of bugs (features yet to be developed). Right now `GET` requests are the only ones that have been tested.

## Usage
Add the API Display widget to a page and explore.

![apiDisplay](/images/api.png)

## How to Build and Deploy to Liferay

### Build it
` $ ./gradlew build `
The jar file will be in `build/libs/com.liferay.jaxrs.api.display.web-1.0.0.jar`.

### Deploy to Liferay
` $ ./gradlew deploy -Pauto.deploy.dir="/path/to/liferay/deploy"`

## Issues & Questions Welcome