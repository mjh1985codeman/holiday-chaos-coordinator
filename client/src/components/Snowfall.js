import React from "react";

const snowflakes = Array.from({ length: 15 }, (_, i) => i);

const Snowfall = () => (
	<div className="snowfall" aria-hidden="true">
		{snowflakes.map((i) => (
			<div key={i} className="snowflake">
				&#10052;
			</div>
		))}
	</div>
);

export default Snowfall;
