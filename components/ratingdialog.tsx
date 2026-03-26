"use client";

import { useState } from "react";
import { rateReferee } from "@/app/actions/referees";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Star } from "lucide-react";

interface RatingDialogProps {
  refereeId: number;
  refereeName: string;
  gameId: number;
  currentRating?: number;
}

export default function RatingDialog({
  refereeId,
  refereeName,
  gameId,
  currentRating,
}: RatingDialogProps) {
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async () => {
    try {
      await rateReferee(refereeId, gameId, rating, 1, comments); // rated_by = 1 (admin)
      setIsOpen(false);
      setRating(0);
      setComments("");
      window.location.reload(); // Simple refresh
    } catch (error) {
      console.error("Error rating referee:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Rate {refereeName}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rate Referee: {refereeName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Current Rating: {currentRating?.toFixed(1) || "Not rated"}</Label>
          </div>
          <div>
            <Label>Your Rating</Label>
            <div className="flex gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="comments">Comments (Optional)</Label>
            <Textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Additional feedback..."
              rows={3}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={rating === 0}>
              Submit Rating
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}