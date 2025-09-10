import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Ship, Calendar, Gauge, DollarSign } from 'lucide-react';
import { LngCargoData } from '@/components/eac-registry/map/types/pipelineTypes';
import { useNavigate } from 'react-router-dom';

interface LngCargoCardProps {
  cargo: LngCargoData;
}

const LngCargoCard: React.FC<LngCargoCardProps> = ({ cargo }) => {
  const navigate = useNavigate();

  const handleReserveCargo = () => {
    // Navigate to purchase dialog with LNG cargo data
    navigate('/eac-registry', {
      state: {
        activeTab: 'active',
        purchaseData: {
          type: 'lng-cargo',
          cargo: cargo,
          terminal: cargo.terminalName
        }
      }
    });
  };

  return (
    <Card className="border border-orange-200 hover:border-orange-300 transition-colors">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Header with vessel info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Ship className="h-4 w-4 mr-2 text-orange-500" />
              <span className="font-medium">{cargo.vesselName}</span>
            </div>
            <Badge variant="outline" className="text-green-700 border-green-200">
              Available
            </Badge>
          </div>

          {/* Company logos */}
          <div className="flex items-center space-x-4">
            <div className="text-xs text-muted-foreground">Producer:</div>
            <div className="flex items-center space-x-2">
              <img src={cargo.producer.logo} alt={cargo.producer.name} className="w-6 h-6 rounded" />
              <span className="text-sm font-medium">{cargo.producer.name}</span>
            </div>
            <div className="text-xs text-muted-foreground">Processor:</div>
            <div className="flex items-center space-x-2">
              <img src={cargo.processor.logo} alt={cargo.processor.name} className="w-6 h-6 rounded" />
              <span className="text-sm font-medium">{cargo.processor.name}</span>
            </div>
            <div className="text-xs text-muted-foreground">Transporter:</div>
            <div className="flex items-center space-x-2">
              <img src={cargo.transporter.logo} alt={cargo.transporter.name} className="w-6 h-6 rounded" />
              <span className="text-sm font-medium">{cargo.transporter.name}</span>
            </div>
          </div>

          {/* Cargo details */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Gauge className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Volume</div>
                <div className="text-sm font-medium">{cargo.volume.toLocaleString()} MMBtu</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Delivery</div>
                <div className="text-sm font-medium">{cargo.deliveryMonth} {cargo.deliveryYear}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Price</div>
                <div className="text-sm font-medium text-green-600">{cargo.price}</div>
              </div>
            </div>
            
            {cargo.loadingDate && (
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Loading</div>
                  <div className="text-sm font-medium">{new Date(cargo.loadingDate).toLocaleDateString()}</div>
                </div>
              </div>
            )}
          </div>

          {/* Reserve button */}
          <div className="flex justify-end">
            <Button 
              onClick={handleReserveCargo}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Reserve Cargo
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LngCargoCard;