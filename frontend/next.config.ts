/** @type {import('next').NextConfig} */
interface WebpackRule {
    test: RegExp; 
    exclude?: RegExp; 
    use: {
        loader: string; 
        options: {
            presets: string[]; 
            plugins: string[]; 
        }
    } | {
        loader: string; 
        options: {
            name: string; 
            outputPath: string; 
            publicPath: string; 
        }
    }[]; 
}

interface NextConfig {
    webpack: (config:any) => any; 
    distDir: string; 
    reactStrictMode: boolean; 
    rewrites: () => Promise<{ source: string; destination: string }[]>; 
    assetPrefix: string; 
}

const nextConfig = NextConfig = {
    webpack: (config) => {
        config.module.rules.push(
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader", 
                    options: {
                        presets: {
                            
                        }
                    }
                }
            }
        )
    }
}