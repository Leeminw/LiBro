@echo off
SETLOCAL ENABLEDELAYEDEXPANSION

REM Components
set components=accordion alert alert-dialog aspect-ratio avatar badge breadcrumb button calendar card carousel checkbox collapsible combobox command context-menu data-table date-picker dialog drawer dropdown-menu form hover-card input input-otp label menubar navigation-menu pagination popover progress radio-group resizable scroll-area select separator sheet skeleton slider sonner switch table tabs textarea toast toggle toggle-group tooltip

REM Loop through each component and install it
for %%c in (%components%) do (
    echo Installing %%c...
    echo yes | npx shadcn-ui@latest add %%c
    echo %%c installed!
)

echo All components installed successfully!
