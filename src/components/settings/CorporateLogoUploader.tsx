
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Image, Upload, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const CorporateLogoUploader = () => {
  const [logo, setLogo] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true);
      
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setLogo(base64String);
        setIsUploading(false);
        
        // In a real implementation, we would upload this to storage
        // and save the URL to the company profile
        
        localStorage.setItem('corporateLogo', base64String);
        
        // Create a storage event to notify other components
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'corporateLogo',
          newValue: base64String
        }));
        
        toast({
          title: "Logo uploaded",
          description: "Your corporate logo has been updated successfully.",
        });
      };
      
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  const removeLogo = () => {
    setLogo(null);
    localStorage.removeItem('corporateLogo');
    
    // Create a storage event to notify other components
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'corporateLogo',
      newValue: null
    }));
    
    toast({
      title: "Logo removed",
      description: "Your corporate logo has been removed.",
    });
  };

  // Load logo from localStorage on component mount
  useEffect(() => {
    const savedLogo = localStorage.getItem('corporateLogo');
    if (savedLogo) {
      setLogo(savedLogo);
    }
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Image className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-medium">Corporate Logo</h3>
      </div>
      
      <div className="flex items-center space-x-6">
        <div className="border rounded-md p-4 bg-muted/50 flex items-center justify-center w-32 h-32">
          {logo ? (
            <Avatar className="w-full h-full rounded-sm">
              <AvatarImage src={logo} alt="Corporate Logo" className="object-contain" />
              <AvatarFallback className="rounded-sm">LOGO</AvatarFallback>
            </Avatar>
          ) : (
            <Image className="h-12 w-12 text-muted-foreground" />
          )}
        </div>
        
        <div className="space-y-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleLogoUpload}
            className="hidden"
            accept="image/*"
          />
          <div className="flex flex-col space-y-2">
            <Button 
              onClick={() => fileInputRef.current?.click()} 
              disabled={isUploading}
              variant="outline"
              className="min-w-[180px]"
            >
              {isUploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Logo
                </>
              )}
            </Button>
            
            {logo && (
              <Button 
                variant="outline" 
                onClick={removeLogo}
                className="text-destructive"
              >
                <X className="mr-2 h-4 w-4" />
                Remove Logo
              </Button>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Recommended size: 400x400px. Supported formats: PNG, JPG, SVG
          </p>
        </div>
      </div>
    </div>
  );
};

export default CorporateLogoUploader;
