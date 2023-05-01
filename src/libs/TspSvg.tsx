import { Button, Checkbox, Group, Stack, Text, Title } from "@mantine/core";
import React from "react";
import { XY, calculateDistance } from "./tsp/Tsp";
import { opt2 } from "./tsp/Opt2";
import { opt3 } from "./tsp/Opt3";
import { Gene, geneToSeq, generateGenes, optGenes } from "./tsp/GA";

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

type Method = '2opt' | '3opt' | 'ga';

function TspSvg() {

  const [points, setPoints] = React.useState<XY[]>([]);
  const [sequences, setSequences] = React.useState<number[]>([]);
  const [method, setMethod] = React.useState<Method | null>('ga');
  const [autoIterate, setAutoIterate] = React.useState(true);
  const [genes, setGenes] = React.useState<Gene[]>([]);  
  const handleClick: React.MouseEventHandler<SVGSVGElement> = (e) => {
    const p = toXY(e);
    setSequences([]);
    setPoints([...points, p]);
  };

  React.useEffect(() => {
    if (method == null) return;

    switch (method) {
      case '2opt':
        if (points.length !== sequences.length) {
          setSequences(points.map((_, i) => i))
          break;
        }
        if (opt2(points, sequences)) {
          if (!autoIterate) {
            setMethod(null);
          }
          setSequences([...sequences]);
        } else {
          setMethod(null);
        }
        break;
      case '3opt':
        if (points.length !== sequences.length) {
          setSequences(points.map((_, i) => i))
          break;
        }
        if (opt3(points, sequences)) {
          if (!autoIterate) {
            setMethod(null);
          }
          setSequences([...sequences]);
        } else {
          setMethod(null);
        }
        break;
      case 'ga':
        const nGene = 512;
        if (points.length !== sequences.length || genes.length !== nGene) {
          const genes = generateGenes(points, nGene);
          setGenes(genes);
          const [gene] = genes;
          if (gene != null) {
            setSequences(geneToSeq(gene.seq));
          } else {
            setSequences([]);
          }
        } else {
          const genes0 = optGenes(points, genes);
          setGenes(genes0);
          const [gene] = genes;
          if (gene != null) {
            setSequences(geneToSeq(gene.seq));
          } else {
            setSequences([]);
          }
        }
        if (!autoIterate) {
          setMethod(null);
        }
        break;
    }
  }, [method, points, sequences, genes]);

  const dist = calculateDistance(points, sequences);
  return (
    <Stack align="center">
      <Title>Traveling salesman problem</Title>
      <Text>Click: Adds one point</Text>
      <svg width={600} height={600} style={{backgroundColor: '#ddd'}} onClick={handleClick}>
        {
          points.length === sequences.length && (
            <polygon
              points={
                sequences.map((i) => {
                  const [x, y] = points[i];
                  return `${x},${y}`;
                }).join(' ')
              }
              fill='none'
              stroke={'#333'}
            />
          )
        }
        {
          points.map(([x, y], i) => {
            return <circle key={i} cx={x} cy={y} r={10} fill='#222' />
          })
        }
      </svg>
      <Group>
        <Button onClick={() => setPoints([])}>Clear Points</Button>
        <Button onClick={() => setSequences([])}>Clear Sequences</Button>
      </Group>
      <Button.Group>
        <Button variant={method === '2opt'? 'filled' : 'outline'} onClick={() => setMethod('2opt')}>2-Opt</Button>
        <Button variant={method === '3opt'? 'filled' : 'outline'} onClick={() => setMethod('3opt')}>3-Opt</Button>
      </Button.Group>
      <Button.Group>
        <Button variant={method === 'ga'? 'filled' : 'outline'} onClick={() => setMethod('ga')}>GA</Button>
        <Button color='gray' disabled={genes.length === 0} onClick={() => setGenes([]) }>Reset Genes</Button>
      </Button.Group>
      <Checkbox checked={autoIterate} onClick={() => setAutoIterate(!autoIterate)} label='Auto-Iterate' />
      <Text>Points: {points.length}, Distance: { dist.toFixed(2) }</Text>
    </Stack>
  )
}
export { TspSvg }