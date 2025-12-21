import { execa } from 'execa';
import { logger } from '../core/logger.js';

export async function runPs(script: string, args: string[] = []): Promise<string> {
    try {
        // To prevent command injection, we pass arguments via environment variables
        // and reconstruct the $args array inside PowerShell.
        // This ensures that arguments are never interpreted as code by the PowerShell parser.
        const envVars: Record<string, string> = {};
        args.forEach((arg, i) => {
            envVars[`PS_ARG_${i}`] = arg;
        });

        const wrapper = `
            $args = @()
            for ($i = 0; $true; $i++) {
                $varName = "PS_ARG_$i"
                if (Test-Path "Env:$varName") {
                    $args += [System.Environment]::GetEnvironmentVariable($varName)
                } else {
                    break
                }
            }
            & { ${script} } @args
        `.trim();

        const { stdout } = await execa('powershell', [
            '-NoProfile',
            '-NonInteractive',
            '-Command',
            wrapper
        ], {
            env: { ...process.env, ...envVars }
        });
        return stdout.trim();
    } catch (error) {
        logger.debug(`PowerShell script failed: ${script}`, error);
        throw error;
    }
}

export async function isAdmin(): Promise<boolean> {
    try {
        // 'net session' only works with admin privileges
        await execa('net', ['session'], { stdio: 'ignore' });
        return true;
    } catch {
        return false;
    }
}

export async function getEnvVar(name: string, scope: 'Machine' | 'User' | 'Process' = 'Machine'): Promise<string | null> {
    try {
        const val = await runPs('& { [Environment]::GetEnvironmentVariable($args[0], $args[1]) }', [name, scope]);
        return val || null;
    } catch {
        return null;
    }
}
