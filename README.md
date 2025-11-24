Meu App de Registro de Viagens

Um aplicativo desenvolvido em React Native com Expo, permitindo que usuários registrem viagens tirando fotos e listando suas viagens em uma lista simples e intuitiva.

Funcionalidades:

Registrar Viagem
O usuário tira uma foto, informa o nome do local e o app salva automaticamente:

Foto

Nome do local

Latitude e longitude do momento da foto

Data e hora do registro

O mapa mostra:

A posição atual do usuário

Minhas Viagens:
Lista todas as viagens do usuário, permitindo:

Editar o nome da viagem

Apagar uma viagem específica

Apagar todas as viagens

Expandir a imagem ao clicar

Suporte a múltiplos usuários
Cada usuário só vê e gerencia suas próprias viagens.

Armazenamento Local
Os dados são salvos usando AsyncStorage, funcionando mesmo offline.

Como rodar o projeto?
git clone https://github.com/anthonyanthonyanthonyanthonyanthony/meu-app

cd meu-app

npm install

npx expo start
