# Spotify Judger

Spotify Judger is a Next.js application that leverages OpenAI's chat completion capabilities to generate a conversation with users about their music taste based on their top tracks and artists from Spotify. This application provides an interactive and engaging experience for users to explore their music preferences in a conversational manner.

## Prerequisites

Before running Spotify Judger, ensure that you have the following prerequisites installed:

- Node.js (v18 or above)
- npm or yarn package manager
- Spotify Developer Account (to obtain API credentials)
- OpenAI API Key

## Getting Started

To set up and run Spotify Judger, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/FinnBuick/spotify-judger.git
```

2. Navigate to the project directory:

```bash
cd spotify-judger
```

3. Install the dependencies:

```bash
yarn install
```

4. Configure the environment variables:

- Rename the `.env.example` file to `.env`.
- Fill in the necessary environment variables in the `.env` file:

  ```
  OPENAI_API_KEY=your-openai-api-key
  SPOTIFY_CLIENT_ID=your-spotify-client-id
  SPOTIFY_CLIENT_SECRET=your-spotify-client-secret
  NEXTAUTH_URL=http://localhost:3000
  NEXTAUTH_SECRET=your-nextauth-secret
  ```

  Replace `your-spotify-client-id`, `your-spotify-client-secret`, and `your-openai-api-key` with your respective credentials. You can obtain your Spotify API credentials by creating a Spotify Developer Account and registering a new application. You can obtain your OpenAI API key by creating an OpenAI account and generating an API key. You can generate a NextAuth secret by running the following command:

  ```bash
  openssl rand -base64 32
  ```

5. Start the application:

```bash
yarn dev
```

6. Navigate to `http://localhost:3000` in your browser to view the application.

## Built With

- [Next.js](https://nextjs.org/) - The React framework for production
- [Tailwind CSS](https://tailwindcss.com/) - The utility-first CSS framework
- [DaisyUI](https://daisyui.com/) - The component library for Tailwind CSS
- [Spotify API](https://developer.spotify.com/documentation/web-api) - The API for retrieving user data from Spotify
- [OpenAI API](https://platform.openai.com/docs/introduction) - The API for generating conversational responses

## Contributing

Contributions to Spotify Judger are welcome! If you encounter any bugs, have suggestions for improvements, or would like to add new features, please open an issue or submit a pull request on the project's GitHub repository.

## License

Spotify Judger is open-source software licensed under the [MIT License](https://opensource.org/licenses/MIT). Feel free to modify and distribute the application as per the terms of the license.
