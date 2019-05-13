# Reload the browser automatically whenever files change
if ENV['RAILS_ENV'] != 'production'
  activate :livereload
end

###
# Compass
###
compass_config do |config|
  config.output_style = :compressed
end

###
# Helpers
###
helpers do
  def get_url
    absolute_prefix + url_prefix
  end
end

###
# Config
###
set :css_dir, 'stylesheets'
set :js_dir, 'javascripts'
set :images_dir, 'images'
set :url_prefix, '/'
set :absolute_prefix, 'http://localhost:4567'

# Build-specific configuration
configure :build do
  puts "local build"
  set :url_prefix, ENV['URL_PREFIX'] || ''
  set :absolute_prefix, ENV['ABSOLUTE_PREFIX'] || ''
  activate :asset_hash
  activate :minify_javascript
  activate :minify_css
end
