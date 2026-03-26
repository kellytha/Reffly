"use client";

import { useState } from "react";
import { updateReferee, deleteReferee, rateRefereeByUser } from "@/app/actions/referees";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const associations = [
  "Gauteng Touch Association (GTA)",
  "Western Cape Touch Association (WCTA)",
  "KwaZulu-Natal Touch Association (KZNTA)",
  "Easterns Touch Association (ETA)",
  "Western province Touch Association (WPTA)",
  "Northern Gauteng Touch Association (NGTA)",
  "South Western District Association (SWDTA)",
  "Buffalo City Touch Association (BCTA)",
];

export default function RefereeCard({
  id,
  name,
  phone_number,
  association,
  club,
  level,
  rating,
}: {
  id: number;
  name: string;
  phone_number: string;
  association?: string;
  club?: string;
  level?: string;
  rating?: number;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editPhone, setEditPhone] = useState(phone_number);
  const [editAssociation, setEditAssociation] = useState(association || "");
  const [editClub, setEditClub] = useState(club || "");
  const [editLevel, setEditLevel] = useState(level || "1");
  const [newRating, setNewRating] = useState<number>(5);
  const { user } = useUser();

  const handleEdit = async () => {
    if (isEditing) {
      await updateReferee(id, {
        name: editName,
        phone_number: editPhone,
        association: editAssociation,
        club: editClub,
        level: editLevel,
      });

      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this referee?")) {
      await deleteReferee(id);
      window.location.reload();
    }
  };

  const handleRate = async () => {
    // Rate using current user; gameId left as undefined for now
    if (!user) {
      alert("Please sign in to rate referees");
      return;
    }
    const ratedBy = user.emailAddresses?.[0]?.emailAddress || user.id;
    await rateRefereeByUser(id, newRating, ratedBy as string, undefined, undefined);
    alert("Rating submitted");
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 border">
      {isEditing ? (
        <div className="space-y-2">
          <div>
            <Label htmlFor={`name-${id}`}>Name</Label>
            <Input
              id={`name-${id}`}
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor={`phone-${id}`}>Phone Number</Label>
            <Input
              id={`phone-${id}`}
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor={`association-${id}`}>Association</Label>
            <Select value={editAssociation} onValueChange={setEditAssociation}>
              <SelectTrigger>
                <SelectValue placeholder="Select association" />
              </SelectTrigger>
              <SelectContent>
                {associations.map((assoc) => (
                  <SelectItem key={assoc} value={assoc}>
                    {assoc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor={`club-${id}`}>Club</Label>
            <Input
              id={`club-${id}`}
              value={editClub}
              onChange={(e) => setEditClub(e.target.value)}
              placeholder="Club affiliation"
            />
          </div>

          <div>
            <Label htmlFor={`level-${id}`}>Level</Label>
            <Select value={editLevel} onValueChange={setEditLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      ) : (
        <>
          <h3 className="text-xl font-bold">{name}</h3>
          <p className="text-gray-600"> {phone_number}</p>
          {association && <p className="text-gray-600"> {association}</p>}
          {club && <p className="text-gray-600"> {club}</p>}
          <p className="text-gray-600">Level: {level || "1"}</p>
          {rating && (
            <p className="text-gray-600">Rating: {rating.toFixed(1)}/5.0</p>
          )}
        </>
      )}

      <div className="flex gap-2 mt-4">
        <Button
          onClick={handleEdit}
          variant={isEditing ? "default" : "outline"}
          className={isEditing ? "bg-green-500" : ""}
        >
          {isEditing ? "Save" : "Edit"}
        </Button>

        <Button onClick={handleDelete} variant="destructive">
          Delete
        </Button>
        <div className="flex items-center gap-2 ml-2">
          <select
            aria-label="Rate referee"
            value={newRating}
            onChange={(e) => setNewRating(parseInt(e.target.value, 10))}
            className="border rounded px-2 py-1"
          >
            {[1,2,3,4,5].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <button className="bg-yellow-500 text-black px-3 py-1 rounded" onClick={handleRate}>
            Rate
          </button>
        </div>
      </div>
    </div>
  );
}
