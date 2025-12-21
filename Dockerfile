FROM node:22.17.0

# Copy Dir
COPY . ./app

# Work to Dir
WORKDIR /app

# Install Node Package


# Set Env


EXPOSE 3100

#COPY wait-for-postgres.sh /app/wait-for-postgres.sh
#RUN chmod +x /app/wait-for-postgres.sh

# Указываем команду для запуска вашего приложения с ожиданием
#CMD ["./wait-for-postgres.sh","postgres_db:5432","--","npm", "start"]

CMD ["npm", "run", "start"]

# Cmd script

