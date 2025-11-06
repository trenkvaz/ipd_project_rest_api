FROM node:22.17.0

# Copy Dir
COPY . ./app

# Work to Dir
WORKDIR /app

# Install Node Package


# Set Env


EXPOSE 3100

COPY wait-for-it.sh /app/wait-for-it.sh
RUN chmod +x /app/wait-for-it.sh

# Указываем команду для запуска вашего приложения с ожиданием
CMD ["./wait-for-it.sh", "postgres_db:5432", "--", "npm", "start"]

# Cmd script

