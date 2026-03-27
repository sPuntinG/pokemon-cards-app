import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

function PokemonCard({ data }) {
  // This ref gives D3 a target to draw into
  const svgRef = useRef();

  // The sprite URL pattern you provided
  const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`;

  useEffect(() => {
    // 1. Select the SVG element using D3
    const svg = d3.select(svgRef.current);

    // Clear any previous drawings (useful during React hot-reloads)
    svg.selectAll("*").remove();

    // 2. Prepare the mini-dataset for this specific Pokémon
    const stats = [
      { label: "HP", value: data.hp, color: "#6f726f" },
      { label: "ATK", value: data.attack, color: "#6f726f" },
    ];

    // 3. Set up scales (Mapping data values to pixel widths)
    // Snorlax has the highest HP (160), so we use 160 as our max domain
    const xScale = d3.scaleLinear().domain([0, 160]).range([0, 120]); // Max width of the bar in pixels

    // 4. Draw the bars
    const barGroups = svg
      .selectAll("g")
      .data(stats)
      .enter()
      .append("g")
      .attr("transform", (d, i) => `translate(0, ${i * 25})`); // Space them vertically

    // Draw the actual rectangle
    barGroups
      .append("rect")
      .attr("x", 30) // Push bars to the right to make room for text
      .attr("y", 0)
      .attr("width", (d) => xScale(d.value))
      .attr("height", 15)
      .attr("fill", (d) => d.color)
      .attr("rx", 3); // Rounded corners

    // Add the stat labels (HP / ATK)
    barGroups
      .append("text")
      .attr("x", 0)
      .attr("y", 12) // Align text with the bar
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .text((d) => d.label);

    // Add the stat values inside/next to the bars
    barGroups
      .append("text")
      .attr("x", (d) => xScale(d.value) + 35)
      .attr("y", 12)
      .attr("font-size", "11px")
      .text((d) => d.value);
  }, [data]); // Re-run if data changes

  return (
    <div className="pokemon-card">
      <div className="card-header">
        <span className="pokemon-id">#{data.id}</span>
        <span className={`type-badge ${data.type.toLowerCase()}`}>
          {data.type}
        </span>
      </div>
      <img src={spriteUrl} alt={data.name} className="pokemon-sprite" />
      <h2>{data.name}</h2>

      {/* The D3 Canvas */}
      <div className="stats-container">
        <svg ref={svgRef} width="200" height="50"></svg>
      </div>
    </div>
  );
}

export default PokemonCard;
