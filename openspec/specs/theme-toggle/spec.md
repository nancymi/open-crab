## ADDED Requirements

### Requirement: User can toggle between light and dark theme
The system SHALL provide a visible toggle control in the site header that switches the UI between light and dark themes without a page reload.

#### Scenario: Toggle from light to dark
- **WHEN** the user clicks the theme toggle while in light mode
- **THEN** the page immediately switches to dark mode visuals

#### Scenario: Toggle from dark to light
- **WHEN** the user clicks the theme toggle while in dark mode
- **THEN** the page immediately switches to light mode visuals

### Requirement: Theme preference is persisted across sessions
The system SHALL store the user's last selected theme in `localStorage` and restore it on subsequent page loads.

#### Scenario: Preference survives page reload
- **WHEN** the user selects dark mode and reloads the page
- **THEN** the page loads in dark mode without flickering to light mode first

#### Scenario: Preference survives new tab
- **WHEN** the user opens a new tab to the same site after selecting dark mode
- **THEN** the new tab loads in dark mode

### Requirement: Theme defaults to OS preference when no preference is stored
The system SHALL apply the OS color scheme preference when no `localStorage` value exists.

#### Scenario: No stored preference, OS is dark
- **WHEN** a user visits for the first time and their OS is in dark mode
- **THEN** the site renders in dark mode

#### Scenario: No stored preference, OS is light
- **WHEN** a user visits for the first time and their OS is in light mode
- **THEN** the site renders in light mode

### Requirement: No flash of wrong theme on load
The system SHALL apply the correct theme synchronously before the first paint to prevent a flash of the wrong theme.

#### Scenario: Dark mode user hard-reloads
- **WHEN** a user with dark mode stored in `localStorage` performs a hard reload
- **THEN** the page renders in dark mode from the very first paint with no visible flash

### Requirement: All UI components support both themes
The system SHALL render all visible UI components with appropriate colors in both light and dark mode.

#### Scenario: Header in dark mode
- **WHEN** dark mode is active
- **THEN** the header background, text, and controls use dark-appropriate colors

#### Scenario: Cards and content areas in dark mode
- **WHEN** dark mode is active
- **THEN** card backgrounds, body text, and borders use dark-appropriate colors without reverting to hardcoded light values
