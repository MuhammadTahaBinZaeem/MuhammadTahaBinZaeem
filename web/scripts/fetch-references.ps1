[CmdletBinding()]
param(
    [string]$Destination = ".reference-sources"
)

$ErrorActionPreference = "Continue"
$repositoryRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$destinationRoot = [System.IO.Path]::GetFullPath((Join-Path $repositoryRoot $Destination))

if (-not $destinationRoot.StartsWith($repositoryRoot + [System.IO.Path]::DirectorySeparatorChar, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Destination must stay inside the repository."
}

$sources = @(
    # Project sources named in the supplied profile material
    @{ Group = "personal-work"; Repo = "MuhammadTahaBinZaeem/Debate-Club" },
    @{ Group = "personal-work"; Repo = "MuhammadTahaBinZaeem/autodecom" },
    @{ Group = "personal-work"; Repo = "MuhammadTahaBinZaeem/Mips_Chess_Engine" },
    @{ Group = "personal-work"; Repo = "MuhammadTahaBinZaeem/PROJECTINFINITY" },
    @{ Group = "personal-work"; Repo = "MuhammadTahaBinZaeem/CS-117-Project" },
    @{ Group = "personal-work"; Repo = "MuhammadTahaBinZaeem/FOP-Project" },

    # Original, award-recognized portfolio sources
    @{ Group = "awwwards-originals"; Repo = "brunosimon/folio-2025" },
    @{ Group = "awwwards-originals"; Repo = "brunosimon/folio-2019" },
    @{ Group = "awwwards-originals"; Repo = "andrewwoan/mr-pandas-psychologically-safe-portfolio" },
    @{ Group = "awwwards-originals"; Repo = "andrewwoan/woan-minecraft-folio" },
    @{ Group = "awwwards-originals"; Repo = "Giats2498/giats-portfolio" },
    @{ Group = "awwwards-originals"; Repo = "bizarro/bruno-arizio" },
    @{ Group = "awwwards-originals"; Repo = "dirdr/utazon-portfolio" },
    @{ Group = "awwwards-originals"; Repo = "wkyleg/brutalist-hacker-news" },
    @{ Group = "awwwards-originals"; Repo = "enderh3art/Ramen-Shop" },
    @{ Group = "awwwards-originals"; Repo = "andrewwoan/sooahs-room-folio" },
    @{ Group = "awwwards-originals"; Repo = "jploch/FieldtypePageGrid" },

    # Praised portfolios and spatial experiments
    @{ Group = "praised-portfolios"; Repo = "andrewwoan/aimee-weis-papercraft-world" },
    @{ Group = "praised-portfolios"; Repo = "andrewwoan/codrops-fan-museum" },
    @{ Group = "praised-portfolios"; Repo = "thorstensson/folio-2025" },
    @{ Group = "praised-portfolios"; Repo = "bchiang7/v4" },
    @{ Group = "praised-portfolios"; Repo = "lynnandtonic/lynnandtonic.com" },
    @{ Group = "praised-portfolios"; Repo = "jlengstorf/jason.af" },
    @{ Group = "praised-portfolios"; Repo = "kentcdodds/kentcdodds.com" },
    @{ Group = "praised-portfolios"; Repo = "leerob/leerob.io" },
    @{ Group = "praised-portfolios"; Repo = "whizkydee/olaolu.dev" },

    # Awwwards recreations and study projects
    @{ Group = "recreations"; Repo = "adrianhajdin/award-winning-website" },
    @{ Group = "recreations"; Repo = "sanidhyy/game-website" },
    @{ Group = "recreations"; Repo = "rodrigogama/awwwards-rebuilt-furrow" },
    @{ Group = "recreations"; Repo = "andrewwoan/abigail-bloom-portolio-bokoko33" },
    @{ Group = "recreations"; Repo = "olivierlarose/awwwards-landing-page" },
    @{ Group = "recreations"; Repo = "MuhammadTanveerAbbas/splyt-awwwards-website" },
    @{ Group = "recreations"; Repo = "m0Corut/keyboard-premium-landing-page" },
    @{ Group = "recreations"; Repo = "aarambh-darshan/rust-portfolio" },
    @{ Group = "recreations"; Repo = "tahsinmert/sveltekit-webgl-experience" },
    @{ Group = "recreations"; Repo = "Thakuma07/Truus.co-Awwward-Website" },
    @{ Group = "recreations"; Repo = "Fullstack-Empire/GSAP-Awwwards-Website" },

    # Production-grade open websites
    @{ Group = "production-sites"; Repo = "midday-ai/midday" },
    @{ Group = "production-sites"; Repo = "dubinc/dub" },
    @{ Group = "production-sites"; Repo = "openstatusHQ/openstatus" },
    @{ Group = "production-sites"; Repo = "documenso/documenso" },
    @{ Group = "production-sites"; Repo = "supabase/supabase" },
    @{ Group = "production-sites"; Repo = "triggerdotdev/trigger.dev" },
    @{ Group = "production-sites"; Repo = "unkeyed/marketing-site" },
    @{ Group = "production-sites"; Repo = "nuxt/nuxt.com" },
    @{ Group = "production-sites"; Repo = "withastro/astro.build" },
    @{ Group = "production-sites"; Repo = "sveltejs/svelte.dev" },
    @{ Group = "production-sites"; Repo = "theatre-js/website" },

    # Reusable motion, 3D, and interface libraries
    @{ Group = "visual-libraries"; Repo = "greensock/GSAP" },
    @{ Group = "visual-libraries"; Repo = "darkroomengineering/lenis" },
    @{ Group = "visual-libraries"; Repo = "mrdoob/three.js" },
    @{ Group = "visual-libraries"; Repo = "pmndrs/react-three-fiber" },
    @{ Group = "visual-libraries"; Repo = "pmndrs/drei" },
    @{ Group = "visual-libraries"; Repo = "motiondivision/motion" },
    @{ Group = "visual-libraries"; Repo = "theatre-js/theatre" },
    @{ Group = "visual-libraries"; Repo = "oframe/ogl" },
    @{ Group = "visual-libraries"; Repo = "DavidHDev/react-bits" },
    @{ Group = "visual-libraries"; Repo = "magicuidesign/magicui" },
    @{ Group = "visual-libraries"; Repo = "ibelick/motion-primitives" },
    @{ Group = "visual-libraries"; Repo = "danielpetho/fancy" },
    @{ Group = "visual-libraries"; Repo = "codse/animata" },
    @{ Group = "visual-libraries"; Repo = "shadcn-ui/ui" }
)

New-Item -ItemType Directory -Path $destinationRoot -Force | Out-Null
$failures = [System.Collections.Generic.List[string]]::new()
$manifestRows = [System.Collections.Generic.List[string]]::new()
$completed = 0

function Get-NormalizedRepositoryUrl {
    param([Parameter(Mandatory = $true)][string]$Url)

    $normalized = $Url.Trim().ToLowerInvariant()
    $normalized = $normalized -replace '^git@github\.com:', 'https://github.com/'
    $normalized = $normalized -replace '\.git/?$', ''
    return $normalized.TrimEnd('/')
}

function Test-ReferenceClone {
    param(
        [Parameter(Mandatory = $true)][string]$Path,
        [Parameter(Mandatory = $true)][string]$Repository
    )

    if (-not (Test-Path (Join-Path $Path ".git"))) {
        return $false
    }

    & git -c core.longpaths=true -C $Path rev-parse --verify "HEAD^{commit}" *> $null
    if ($LASTEXITCODE -ne 0) {
        return $false
    }

    $originOutput = @(& git -c core.longpaths=true -C $Path remote get-url origin 2>$null)
    $originExitCode = $LASTEXITCODE
    if ($originExitCode -ne 0 -or $originOutput.Count -eq 0) {
        return $false
    }
    $origin = $originOutput[0]

    $expectedOrigin = Get-NormalizedRepositoryUrl "https://github.com/$Repository"
    if ((Get-NormalizedRepositoryUrl $origin) -ne $expectedOrigin) {
        return $false
    }

    $shallowOutput = @(& git -c core.longpaths=true -C $Path rev-parse --is-shallow-repository 2>$null)
    $shallowExitCode = $LASTEXITCODE
    if ($shallowExitCode -ne 0 -or $shallowOutput.Count -eq 0 -or $shallowOutput[0].Trim() -ne "true") {
        return $false
    }

    $trackedChanges = @(& git -c core.longpaths=true -C $Path status --porcelain --untracked-files=no 2>$null)
    if ($LASTEXITCODE -ne 0 -or $trackedChanges.Count -gt 0) {
        return $false
    }

    return $true
}

function Assert-SafeVaultPath {
    param([Parameter(Mandatory = $true)][string]$Path)

    $fullPath = [System.IO.Path]::GetFullPath($Path)
    if (-not $fullPath.StartsWith($destinationRoot + [System.IO.Path]::DirectorySeparatorChar, [System.StringComparison]::OrdinalIgnoreCase)) {
        throw "Refusing to mutate a path outside the reference vault: $fullPath"
    }
    return $fullPath
}

function Move-IncompleteClone {
    param(
        [Parameter(Mandatory = $true)][string]$Path,
        [Parameter(Mandatory = $true)][string]$Repository
    )

    $safePath = Assert-SafeVaultPath $Path
    $quarantineRoot = Join-Path $destinationRoot "_incomplete"
    New-Item -ItemType Directory -Path $quarantineRoot -Force | Out-Null
    $safeName = $Repository -replace '[^a-zA-Z0-9._-]', '__'
    $stamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $quarantinePath = Join-Path $quarantineRoot "$safeName-$stamp"
    Write-Output "HOLD  $Repository -> $quarantinePath"
    Move-Item -LiteralPath $safePath -Destination $quarantinePath
}

function Remove-PartialClone {
    param([Parameter(Mandatory = $true)][string]$Path)

    if (-not (Test-Path -LiteralPath $Path)) {
        return
    }
    $safePath = Assert-SafeVaultPath $Path
    if ([System.IO.Path]::GetFileName($safePath) -notlike "*.partial-*") {
        throw "Refusing to remove a path that is not a partial clone: $safePath"
    }
    Remove-Item -LiteralPath $safePath -Recurse -Force
}

foreach ($source in $sources) {
    $owner, $name = $source.Repo -split "/", 2
    $groupPath = Join-Path $destinationRoot $source.Group
    $targetPath = Join-Path $groupPath ("{0}__{1}" -f $owner, $name)

    New-Item -ItemType Directory -Path $groupPath -Force | Out-Null

    if (Test-ReferenceClone -Path $targetPath -Repository $source.Repo) {
        Write-Output "SKIP  $($source.Repo)"
        $completed++
        $commitOutput = @(& git -C $targetPath rev-parse HEAD 2>$null)
        $commit = $commitOutput[0]
        $manifestRows.Add("$($source.Group)`t$($source.Repo)`t$commit`tVALID")
        continue
    }

    if (Test-Path -LiteralPath $targetPath) {
        Move-IncompleteClone -Path $targetPath -Repository $source.Repo
    }

    $cloned = $false
    for ($attempt = 1; $attempt -le 3 -and -not $cloned; $attempt++) {
        $tempPath = "$targetPath.partial-$PID-$attempt"
        Remove-PartialClone -Path $tempPath
        Write-Output "CLONE $($source.Repo) (attempt $attempt/3)"
        & git -c core.longpaths=true -c http.version=HTTP/1.1 clone --depth 1 --single-branch --no-tags --filter=blob:none "https://github.com/$($source.Repo).git" $tempPath

        if ($LASTEXITCODE -eq 0 -and (Test-ReferenceClone -Path $tempPath -Repository $source.Repo)) {
            Move-Item -LiteralPath $tempPath -Destination $targetPath
            $cloned = $true
            $completed++
            $commitOutput = @(& git -C $targetPath rev-parse HEAD 2>$null)
            $commit = $commitOutput[0]
            $manifestRows.Add("$($source.Group)`t$($source.Repo)`t$commit`tVALID")
        } else {
            Remove-PartialClone -Path $tempPath
            if ($attempt -lt 3) {
                Start-Sleep -Seconds (2 * $attempt)
            }
        }
    }

    if (-not $cloned) {
        $failures.Add($source.Repo)
        $manifestRows.Add("$($source.Group)`t$($source.Repo)`t-`tFAILED")
    }
}

$manifestPath = Join-Path $destinationRoot "manifest.tsv"
@("group`trepository`tcommit`tstatus") + $manifestRows | Set-Content -LiteralPath $manifestPath -Encoding UTF8
Write-Output "Completed $completed of $($sources.Count) reference repositories."
Write-Output "Manifest: $manifestPath"
if ($failures.Count -gt 0) {
    Write-Warning ("Failed: " + ($failures -join ", "))
    exit 1
}
