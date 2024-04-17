# Get image
FROM alpine:3.4

# Install the necessary image packages
RUN apk add --no-cache --update ruby ruby-dev ruby-bundler python py-pip git build-base libxml2-dev libxslt-dev
RUN pip install boto s3cmd

COPY fakes3.gemspec Gemfile Gemfile.lock /app/
COPY lib/fakes3/version.rb /app/lib/fakes3/

# Create the app directory
WORKDIR /app

# Install the application dependencies
RUN bundle install

# Copy the rest of the application code into the container
COPY . .

# Expose port for the application
EXPOSE 5000

# Define the volume for the application
VOLUME /app/fake-s3

# Define the command to run the application
CMD ["bin/fakes3", "-r", "./fake-s3", "-p", "5000", "--license", "YOUR_LICENSE_KEY"]
