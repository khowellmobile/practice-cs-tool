# Practice CS Tool (Work in Progress)

The Practice CS Tool is a powerful application designed to generate custom reports from a Practice CS database, conveniently hosted on a local server. This tool streamlines the process of extracting and analyzing data, offering insights and analytics tailored to your specific needs.

## Tech Stack

- **Python**: The core programming language used for the backend logic and data processing.
- **Django**: A high-level Python web framework that facilitates rapid development and clean, pragmatic design.
- **Pyodbc**: A Python library that provides an interface for accessing ODBC databases, essential for connecting to the SQL Server housing the Practice CS database.
- **SQL Server**: A robust relational database management system utilized for storing and managing the Practice CS database.

## Features

- **Custom Reports**: Generate detailed reports customized to your requirements, extracting relevant data from the Practice CS database.
- **Local Server Support**: Seamlessly connect to your locally hosted Practice CS database for efficient data retrieval and analysis.
- **User-Friendly Interface**: Enjoy a user-friendly interface designed for ease of use, allowing users to navigate and interact with the tool effortlessly.
- **Data Insights**: Gain valuable insights and analytics from your Practice CS data, empowering informed decision-making and strategic planning.

## Getting Started

To run the Practice CS Tool:

1. **Clone Repository**: Clone this repository to your local machine using `git clone https://github.com/your-username/practice-cs-tool.git`.
2. **Install Major Dependencies**: Navigate to the project directory and install [Node.js](https://nodejs.org/en/download/) and [Python](https://www.python.org/downloads/).
3. **Install Dependencies**:
   - **Python Libraries**: Ensure you have installed the proper Python libraries:
     - A list of the modules can be found in requirements.txt or run `pip install -r requirements.txt`
   - **JavaScript Libraries**: Additionally, make sure you have the following JavaScript libraries installed to facilitate JavaScript testing:
     - [Jest](https://jestjs.io/): A JavaScript testing framework.
     - [jQuery](https://jquery.com/): A fast, small, and feature-rich JavaScript library.
     - [jsdom](https://github.com/jsdom/jsdom): A JavaScript implementation of various web standards, for use with Node.js
4. **Run Server**: Start the Django development server using `python manage.py runserver`.
5. **Access the Tool**: Open your web browser and navigate to `http://localhost:8000` to access the Practice CS Tool.

NOTE: Currently the app only runs with Microsoft SQL Server Database and PostgreSql

## Contributing

Contributions are welcome! Feel free to submit bug reports, feature requests, or pull requests to help improve the Practice CS Tool and make it even more powerful and user-friendly.

## License

This project is licensed under the [MIT License](LICENSE), allowing for flexibility and freedom for both personal and commercial use.
