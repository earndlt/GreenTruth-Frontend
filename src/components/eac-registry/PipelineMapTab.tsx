
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PenLine, Info } from 'lucide-react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { useLocation } from 'react-router-dom';
import { DeliveryPointData } from './map/types/pipelineTypes';
import EacSearchResults from './EacSearchResults';
import { usePipelineSelections } from '@/hooks/use-pipeline-selections';
import SelectorPanel from './pipeline-map/SelectorPanel';
import MapContainer from './pipeline-map/MapContainer';
import { useToast } from '@/hooks/use-toast';

const PipelineMapTab = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [selectedDeliveryPoint, setSelectedDeliveryPoint] = useState<DeliveryPointData | null>(null);
  const [mapVisible, setMapVisible] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [mapKey, setMapKey] = useState(0); // Key to force map re-render only when necessary

  const {
    pipelineSelections,
    activePipelines,
    handlePipelineToggle,
    getActivePipelineSelections,
    ensureCorrectPipelineSelected
  } = usePipelineSelections(selectedDeliveryPoint);

  // Check if we have a selectedDeliveryPoint from navigation state
  useEffect(() => {
    if (location.state && location.state.selectedDeliveryPoint) {
      const point = location.state.selectedDeliveryPoint;
      console.log("Received delivery point from navigation:", point);

      // First ensure the correct pipeline is selected for this point
      if (point.pipeline) {
        console.log(`Ensuring pipeline ${point.pipeline} is selected for point ${point.name}`);
        // Set the selected point first to avoid potential race conditions
        setSelectedDeliveryPoint(point);

        // Ensure the pipeline is selected - this will automatically update activePipelines
        ensureCorrectPipelineSelected(point);

        // Show a notification
        toast({
          title: "Location Selected",
          description: `Viewing ${point.name} in ${point.county}, ${point.state}`,
        });

        // Force map to re-render when point is selected from external navigation
        // but not when selected from within the map
        setTimeout(() => setMapKey(prev => prev + 1), 100);
      }
    }
  }, [location.state, ensureCorrectPipelineSelected, toast]);

  // Clear the selected delivery point when no pipelines are selected
  useEffect(() => {
    const activePipelineSelections = getActivePipelineSelections();
    if (activePipelineSelections.length === 0 && selectedDeliveryPoint) {
      setSelectedDeliveryPoint(null);
    }
  }, [pipelineSelections, getActivePipelineSelections, selectedDeliveryPoint]);

  const handleSelectDeliveryPoint = (point: DeliveryPointData) => {
    console.log("Selected delivery point:", point.name);
    setSelectedDeliveryPoint(point);
  };

  // Wrapper for pipeline toggle that clears selected point if its pipeline is deselected
  const handlePipelineToggleWithClear = (id: string, checked: boolean) => {
    // If unchecking a pipeline, check if the selected point belongs to this pipeline
    if (!checked && selectedDeliveryPoint) {
      // This is a simple check - you might need more logic if the relationship between
      // points and pipelines is more complex
      const pointPipelineId = selectedDeliveryPoint.pipeline ||
        (id === 'rex' ? 'rex' : 'ruby');

      // If the deselected pipeline contains the currently selected point, clear the selection
      if (pointPipelineId === id) {
        setSelectedDeliveryPoint(null);
      }
    }

    // Call the original toggle function
    handlePipelineToggle(id, checked);

    // We should force a map refresh when toggling pipelines
    setMapKey(prev => prev + 1);
  };

  const toggleMap = () => {
    setMapVisible(!mapVisible);
  };

  const handleToggleLabels = (show: boolean) => {
    setShowLabels(show);
    // Force map re-render to update labels
    setMapKey(prev => prev + 1);
  };

  return (
    <div className="pt-4 space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center">
            <PenLine className="h-5 w-5 mr-2 text-blue-500" />
            <CardTitle>EAC Discovery</CardTitle>
          </div>
          <CardDescription>
            Find and purchase Environmental Attribute Certificates from major natural gas pipelines and LNG terminals
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex items-center">
                <Info className="h-5 w-5 mr-2 text-blue-600" />
                <p className="text-sm text-blue-700">
                  Select one or more pipelines to view EAC opportunities
                </p>
              </div>
            </div>

            <ResizablePanelGroup direction="horizontal" className="min-h-[600px] rounded-lg border">
              <ResizablePanel defaultSize={25} minSize={20}>
                <SelectorPanel
                  pipelineSelections={pipelineSelections}
                  onPipelineToggle={handlePipelineToggleWithClear}
                  selectedDeliveryPoint={selectedDeliveryPoint}
                  showLabels={showLabels}
                  onToggleLabels={handleToggleLabels}
                />
              </ResizablePanel>

              <ResizableHandle withHandle />

              <ResizablePanel defaultSize={75}>
                <div className="h-full p-4">
                  <MapContainer
                    mapVisible={mapVisible}
                    toggleMap={toggleMap}
                    mapKey={mapKey}
                    activePipelines={activePipelines}
                    activePipelineSelections={getActivePipelineSelections()}
                    selectedDeliveryPoint={selectedDeliveryPoint}
                    onSelectDeliveryPoint={handleSelectDeliveryPoint}
                    showLabels={showLabels}
                  />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>

            {selectedDeliveryPoint && (
              <EacSearchResults deliveryPoint={selectedDeliveryPoint} />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PipelineMapTab;
