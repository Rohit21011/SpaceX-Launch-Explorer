SpaceX Launches Dashboard

A React-based web application to explore SpaceX launch data using the SpaceX API. The app displays a paginated table of launches with search, filtering, sorting, and navigation to individual launch details.

Features

1.Launch List:

    1.Displays SpaceX launches in a responsive table with columns for Name, Flight Number, Date, Success, and Rocket.

    2.Supports pagination with configurable page sizes (6, 10, 20).

    3.Allows sorting by Name, Flight Number, or Date (ascending/descending).

    4.Includes search by launch name or details with debounced input (500ms).

    5.Filters launches by success status (All, Successful, Failed).

    6.Clicking a row navigates to a detail page for the selected launch.

2.Launch Detail Page (Placeholder):

    1.Displays detailed information for a specific launch (accessible via /launch/:id).

    2.Fetches data using the SpaceX API's /launch/:id endpoint.

3.UI:

    1.Built with Mantine UI for a modern, responsive design.

    2.Features hover effects, row transitions, and styled pagination controls.

    3.Search and filter inputs are aligned in a single line with consistent styling.

4.API Integration:

    1.Uses Axios to query the SpaceX API (https://api.spacexdata.com/v4).

    2.Supports server-side search, filtering, sorting, and pagination.

    3.Populates rocket data for each launch.

4.Error Handling:

    1.Displays an error fallback component for API failures with a retry option.

    2.Handles edge cases like missing data (e.g., success: null, no rocket name).
