import { Img } from "react-image";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { orbit } from "ldrs";

interface RestaurantCardProps {
  id: string;
  name: string;
  cuisine: string;
  imageUrl: string;
}

export function RestaurantCard({
  id,
  name,
  cuisine,
  imageUrl,
}: RestaurantCardProps) {
  orbit.register();
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardContent className="p-0 justify-center">
        <Img
          src={imageUrl}
          alt={name}
          width={300}
          height={200}
          className="w-full h-48 object-cover"
          unloader={
            <div className="flex justify-center p-5 h-[200px] items-center">
              <l-orbit size="35" speed="1.5" color="black"></l-orbit>
            </div>
          }
        />
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-2">{name}</h3>
          <p className="text-sm text-gray-600">{cuisine}</p>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 border-t border-gray-100 p-4">
        <Button asChild className="w-full">
          <Link to={`/menu/${id}`}>View Menu</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
