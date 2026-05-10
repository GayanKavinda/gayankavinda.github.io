$files = @(
    "src/components/animations/ScrollImageSequence.tsx",
    "src/components/CircularGallery.css",
    "src/components/CircularGallery.tsx",
    "src/components/common/index.ts",
    "src/components/common/NavLink.tsx",
    "src/components/layout/index.ts",
    "src/components/ui/accordion.tsx",
    "src/components/ui/alert-dialog.tsx",
    "src/components/ui/alert.tsx",
    "src/components/ui/aspect-ratio.tsx",
    "src/components/ui/avatar.tsx",
    "src/components/ui/breadcrumb.tsx",
    "src/components/ui/calendar.tsx",
    "src/components/ui/carousel.tsx",
    "src/components/ui/chart.tsx",
    "src/components/ui/checkbox.tsx",
    "src/components/ui/collapsible.tsx",
    "src/components/ui/command.tsx",
    "src/components/ui/context-menu.tsx",
    "src/components/ui/dialog.tsx",
    "src/components/ui/drawer.tsx",
    "src/components/ui/dropdown-menu.tsx",
    "src/components/ui/form.tsx",
    "src/components/ui/hover-card.tsx",
    "src/components/ui/index.ts",
    "src/components/ui/input-otp.tsx",
    "src/components/ui/marquee.tsx",
    "src/components/ui/menubar.tsx",
    "src/components/ui/navigation-menu.tsx",
    "src/components/ui/pagination.tsx",
    "src/components/ui/popover.tsx",
    "src/components/ui/progress.tsx",
    "src/components/ui/radio-group.tsx",
    "src/components/ui/resizable.tsx",
    "src/components/ui/scroll-area.tsx",
    "src/components/ui/ScrollReveal.css",
    "src/components/ui/ScrollReveal.tsx",
    "src/components/ui/select.tsx",
    "src/components/ui/separator.tsx",
    "src/components/ui/sheet.tsx",
    "src/components/ui/sidebar.tsx",
    "src/components/ui/skeleton.tsx",
    "src/components/ui/slider.tsx",
    "src/components/ui/sonner.tsx",
    "src/components/ui/table.tsx",
    "src/components/ui/tabs.tsx",
    "src/components/ui/toast.tsx",
    "src/components/ui/toaster.tsx",
    "src/components/ui/toggle-group.tsx",
    "src/components/ui/toggle.tsx",
    "src/components/ui/tracing-beam.tsx",
    "src/components/ui/use-toast.ts",
    "src/features/home/components/ArchDiagram.tsx",
    "src/features/home/components/SystemPillars.tsx",
    "src/hooks/index.ts",
    "src/hooks/use-mobile.tsx",
    "src/hooks/use-toast.ts",
    "src/lib/index.ts",
    "src/styles/App.css",
    "config/eslint.config.js",
    "config/playwright.config.ts",
    "config/postcss.config.js",
    "config/vitest.config.ts",
    "playwright-fixture.ts",
    "skills/skills/algorithmic-art/templates/generator_template.js"
)

$deletedCount = 0

foreach ($file in $files) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "Deleted $file"
        $deletedCount++
    } else {
        Write-Host "File not found: $file"
    }
}

Write-Host "Successfully deleted $deletedCount files."
