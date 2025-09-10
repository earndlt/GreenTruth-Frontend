
import { useState, useEffect, useCallback } from 'react';
import { PipelineData, PipelineSelection, DeliveryPointData } from '@/components/eac-registry/map/types/pipelineTypes';
import { rexPipelineData } from '@/data/rex-pipeline';
import { rubyPipelineData } from '@/data/rubyPipelineData';
import { plaqueminesTerminalData, sabinePassTerminalData } from '@/data/lng-terminals';

export const usePipelineSelections = (selectedDeliveryPoint: DeliveryPointData | null) => {
  const [pipelineSelections, setPipelineSelections] = useState<PipelineSelection[]>([
    {
      id: 'rex',
      name: 'Rockies Express',
      checked: false,
      data: rexPipelineData,
      color: '#3498db'
    },
    {
      id: 'ruby',
      name: 'Ruby Pipeline',
      checked: false,
      data: rubyPipelineData,
      color: '#D946EF'
    },
    {
      id: 'plaquemines',
      name: 'Plaquemines LNG Terminal',
      checked: false,
      data: plaqueminesTerminalData,
      color: '#FF6B35'
    },
    {
      id: 'sabine-pass',
      name: 'Sabine Pass LNG Facility',
      checked: false,
      data: sabinePassTerminalData,
      color: '#FF6B35'
    }
  ]);

  const [activePipelines, setActivePipelines] = useState<PipelineData[]>([]);

  // Determine which pipeline a delivery point belongs to
  const getPipelineForDeliveryPoint = useCallback((point: DeliveryPointData): string => {
    // If the point already has a pipeline property defined, use that
    if (point.pipeline) {
      return point.pipeline;
    }

    // Check if point name contains pipeline name (simple heuristic)
    if (point.name.toLowerCase().includes('ruby')) {
      return 'ruby';
    }

    // Check if state is western US (Ruby pipeline states)
    const rubyStates = ['oregon', 'nevada', 'utah', 'wyoming', 'idaho', 'california'];
    if (rubyStates.includes(point.state.toLowerCase())) {
      return 'ruby';
    }

    // Default to REX pipeline for central/eastern states
    return 'rex';
  }, []);

  // Ensure the correct pipeline is selected for the delivery point
  const ensureCorrectPipelineSelected = useCallback((point: DeliveryPointData) => {
    const pipelineId = point.pipeline || getPipelineForDeliveryPoint(point);

    console.log(`Ensuring pipeline ${pipelineId} is selected for point ${point.name}`);

    setPipelineSelections(prev =>
      prev.map(pipeline => ({
        ...pipeline,
        // If this is the pipeline our point belongs to, ensure it's checked
        checked: pipeline.id === pipelineId ? true : pipeline.checked
      }))
    );
  }, [getPipelineForDeliveryPoint]);

  // If we have a selectedDeliveryPoint, ensure the correct pipeline is selected
  useEffect(() => {
    if (selectedDeliveryPoint) {
      ensureCorrectPipelineSelected(selectedDeliveryPoint);
    }
  }, [selectedDeliveryPoint, ensureCorrectPipelineSelected]);

  // This useEffect will update active pipelines whenever selections change
  useEffect(() => {
    const filteredPipelines = pipelineSelections
      .filter(p => p.checked)
      .map(p => p.data);

    setActivePipelines(filteredPipelines);
  }, [pipelineSelections]);

  const handlePipelineToggle = useCallback((id: string, checked: boolean) => {
    setPipelineSelections(prev =>
      prev.map(pipeline =>
        pipeline.id === id ? { ...pipeline, checked } : pipeline
      )
    );
  }, []);

  const getActivePipelineSelections = useCallback(() => {
    return pipelineSelections.filter(p => p.checked);
  }, [pipelineSelections]);

  return {
    pipelineSelections,
    activePipelines,
    handlePipelineToggle,
    getActivePipelineSelections,
    ensureCorrectPipelineSelected,
    getPipelineForDeliveryPoint
  };
};
