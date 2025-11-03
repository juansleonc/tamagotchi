# Rails Setup Guide

## Prerequisites

- Ruby 3.1+ installed
- PostgreSQL 12+ installed
- Bundler gem installed

## Initial Setup

### 1. Create Rails API Application

```bash
rails new tamagochi-api --api --database=postgresql
cd tamagochi-api
```

### 2. Add Required Gems

Add to `Gemfile`:

```ruby
gem 'graphql'
gem 'graphql-ruby'
gem 'rspec-rails'
gem 'pg'
gem 'jwt'
gem 'rack-cors'

group :development, :test do
  gem 'rspec-rails'
  gem 'rubocop'
end
```

Install gems:

```bash
bundle install
```

### 3. Initialize RSpec

```bash
rails generate rspec:install
```

### 4. Setup GraphQL

```bash
rails generate graphql:install
```

This creates:
- `app/graphql/tamagochi_api_schema.rb`
- GraphQL types directory structure

### 5. Configure Database

Edit `config/database.yml` and create database:

```bash
rails db:create
rails db:migrate
```

### 6. Configure CORS

In `config/application.rb`:

```ruby
config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins '*'
    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head]
  end
end
```

## Project Structure

```
tamagochi-api/
├── app/
│   ├── graphql/
│   │   ├── types/          # GraphQL types
│   │   ├── mutations/      # GraphQL mutations
│   │   └── resolvers/      # GraphQL resolvers
│   ├── models/             # ActiveRecord models
│   ├── controllers/        # API controllers (minimal)
│   └── services/           # Business logic
├── spec/                    # RSpec tests
└── db/                      # Database migrations
```

## Running the Server

```bash
rails server
```

GraphQL endpoint: `http://localhost:3000/graphql`

## Testing

```bash
# Run all tests
bundle exec rspec

# Run specific test file
bundle exec rspec spec/models/user_spec.rb
```

## Next Steps

- [GraphQL Setup Guide](../setup/graphql-setup.md)
- [Development Workflow](../guides/development-workflow.md)

