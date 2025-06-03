/** @type {import('next').NextConfig} */
interface WebpackRule {
  test: RegExp;
  exclude?: RegExp;
  use:
    | {
        loader: string;
        options: {
          presets: string[];
          plugins: string[];
        };
      }
    | {
        loader: string;
        options: {
          name: string;
          outputPath: string;
          publicPath: string;
        };
      }[];
}

interface NextConfig {
  webpack: (config: any) => any;
  distDir: string;
  reactStrictMode: boolean;
  rewrites: () => Promise<{ source: string; destination: string }[]>;
  assetPrefix: string;
}

const config: NextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: "babel-loader",
        options: {
          presets: {},
        },
      },
    });
    return config; // Make sure to return the config!
  },
  distDir: ".next",
  reactStrictMode: true,
  rewrites: async () => [{ source: "/old-path", destination: "/new-path" }],
  assetPrefix: "",
};

export default config;
