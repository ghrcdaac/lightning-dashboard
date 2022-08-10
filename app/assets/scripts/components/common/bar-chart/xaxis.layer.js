import * as d3 from 'd3';
import * as d3fc from '@d3fc/d3fc-axis';
import { css } from 'styled-components';

const styles = props => css`
  /* XAxis specific styles */
`;

export default {
  styles,
  init: ctx => {
    ctx.svg.append('g').attr('class', 'x axis');
  },

  update: ctx => {
    const { svg, xScale } = ctx;
    const { left } = ctx.margin;
    const { height } = ctx.getSize();
    var xAxis;

    if(ctx.props.id === 'TRMM LIS Seasonal'){
      var xScaled = d3.scalePoint([])
      //.domain([new Date('December 01, 1995 03:24:00')])
      .domain(['Spring','Summer','Autumn','Winter'])
      .range([80, ctx.container.width-62]);
  
      const x = d3.axisBottom(xScaled).tickValues(['Spring','Summer','Autumn','Winter'])
  
      svg
      .select(".x.axis")
      .attr('transform', `translate(0,190)`)     // This controls the vertical position of the Axis
      .call(x);

      return;
    }

    xAxis = d3fc.axisBottom(xScale)
      .tickSize(0)
      .tickPadding(8)
      .ticks(4)
      .tickFormat(d3.timeFormat('%b %y\''));

    svg.select('.x.axis')
      .attr('transform', `translate(${left},${height + 8})`)
      .call(d3fc.axisLabelRotate(xAxis).labelRotate(45));
  }
};
