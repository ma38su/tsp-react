import { Button, Checkbox, Group, Stack, Text, Title } from "@mantine/core";
import React from "react";
import { XY, calculateDistance } from "./tsp/Tsp";
import { opt2 } from "./tsp/Opt2";
import { opt3 } from "./tsp/Opt3";

function toXY(ev: React.MouseEvent<SVGSVGElement, MouseEvent>): XY {
  const {
    clientX, clientY,
    currentTarget: svg,
  } = ev;
  
  const point = svg.createSVGPoint();
  point.x = clientX;
  point.y = clientY;
  
  const svgPoint = point.matrixTransform(svg.getScreenCTM()?.inverse());
  const x = svgPoint.x;
  const y = svgPoint.y;
  return [x, y];
}

type Method = '2opt' | '3opt';

function TspSvg() {
  const [points, setPoints] = React.useState<XY[]>([]);
  const [method, setMethod] = React.useState<Method | null>(null);
  const [autoIterate, setAutoIterate] = React.useState(false);
  const handleClick: React.MouseEventHandler<SVGSVGElement> = (e) => {
    const p = toXY(e);
    setPoints([...points, p]);
  };
  const clearPoints = () => {
    setPoints([]);
  }
  const handleOpt2 = () => {
    setMethod('2opt');
  }
  const handleOpt3 = () => {
    setMethod('3opt');
  }

  React.useEffect(() => {
    if (method == null) return;
    switch (method) {
      case '2opt':
        if (opt2(points)) {
          if (!autoIterate) {
            setMethod(null);
          }
          setPoints([...points]);
        } else {
          setMethod(null);
        }
        break;
      case '3opt':
        if (opt3(points)) {
          if (!autoIterate) {
            setMethod(null);
          }
          setPoints([...points]);
        } else {
          setMethod(null);
        }
    }
  }, [method, points]);

  const dist = calculateDistance(points);
  return (
    <Stack align="center">
      <Title>Traveling salesman problem</Title>
      <Text>Click: Adds one point</Text>
      <svg width={600} height={600} style={{backgroundColor: '#ddd'}} onClick={handleClick}>
        <polygon points={
          points.map(([x, y]) => {
            return `${x},${y}`;
          }).join(' ')
        } fill='none' stroke={'#333'} />
        {
          points.map(([x, y], i) => {
            return <circle key={i} cx={x} cy={y} r={10} fill='#222' />
          })
        }
      </svg>
      <Group>
        <Button onClick={clearPoints}>Clear</Button>
        <Button onClick={handleOpt2}>2-Opt</Button>
        <Button onClick={handleOpt3}>3-Opt</Button>
        <Checkbox onClick={() => setAutoIterate(!autoIterate)} label='Auto-Iterate' />
      </Group>
      <Text>Points: {points.length}, Distance: { dist.toFixed(2) }</Text>
    </Stack>
  )
}
export { TspSvg }