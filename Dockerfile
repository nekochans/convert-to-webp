FROM public.ecr.aws/lambda/nodejs:12

WORKDIR /node/app

COPY package*.json ./

RUN npm ci

COPY . .

CMD ["/bin/bash"]
