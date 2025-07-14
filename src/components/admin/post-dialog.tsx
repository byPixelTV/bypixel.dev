"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Posts } from "../../../types/appwrite";

interface PostFormData {
  title: string;
  shortDescription: string;
  thumbnail: string;
  slug: string;
  draft: boolean;
  content: string;
}

interface PostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post?: Posts;
  onSave: (postData: PostFormData) => void;
}

export function PostDialog({
  open,
  onOpenChange,
  post,
  onSave,
}: PostDialogProps) {
  const [formData, setFormData] = useState<PostFormData>({
    title: "",
    shortDescription: "",
    thumbnail: "",
    slug: "",
    draft: true,
    content: "",
  });

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || "",
        shortDescription: post["short-description"] || "",
        thumbnail: post.thumbnail || "", // Das ist eigentlich ok
        slug: post["post-slug"] || "",
        draft: post.draft ?? true,
        content: post.content || "",
      });
    } else {
      setFormData({
        title: "",
        shortDescription: "",
        thumbnail: "",
        slug: "",
        draft: true,
        content: "",
      });
    }
  }, [post, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleInputChange = (
    field: keyof PostFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-black text-white border border-neutral-800">
        <DialogHeader>
          <DialogTitle className="text-white">
            {post ? "Edit Post" : "Create New Post"}
          </DialogTitle>
          <DialogDescription className="text-neutral-400">
            {post
              ? "Make changes to your post here."
              : "Fill in the details to create a new post."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-white">
                Title
              </Label>
              <Input
                id="title"
                className="bg-neutral-900 text-white border-neutral-700 placeholder:text-neutral-500"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter post title..."
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="shortDescription" className="text-white">
                Short Description
              </Label>
              <Input
                id="shortDescription"
                className="bg-neutral-900 text-white border-neutral-700 placeholder:text-neutral-500"
                value={formData.shortDescription}
                onChange={(e) =>
                  handleInputChange("shortDescription", e.target.value)
                }
                placeholder="Enter short description..."
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="thumbnail" className="text-white">
                Thumbnail URL
              </Label>
              <Input
                id="thumbnail"
                className="bg-neutral-900 text-white border-neutral-700 placeholder:text-neutral-500"
                value={formData.thumbnail}
                onChange={(e) => handleInputChange("thumbnail", e.target.value)}
                placeholder="Enter thumbnail URL..."
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="slug" className="text-white">
                Slug
              </Label>
              <Input
                id="slug"
                className="bg-neutral-900 text-white border-neutral-700 placeholder:text-neutral-500"
                value={formData.slug}
                onChange={(e) => handleInputChange("slug", e.target.value)}
                placeholder="Enter post slug..."
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="draft" className="text-white">
                Status
              </Label>
              <Select
                value={formData.draft ? "draft" : "published"}
                onValueChange={(value) =>
                  handleInputChange("draft", value === "draft")
                }
              >
                <SelectTrigger className="bg-neutral-900 text-white border-neutral-700">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-900 text-white border-neutral-700">
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="content" className="text-white">
                Content
              </Label>
              <Textarea
                id="content"
                className="min-h-[120px] bg-neutral-900 text-white border-neutral-700 placeholder:text-neutral-500"
                value={formData.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                placeholder="Write your post content here..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              onClick={() => onOpenChange(false)}
              className="gap-2 bg-red-600 hover:bg-red-700 text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-white text-black hover:bg-neutral-200"
            >
              {post ? "Update Post" : "Create Post"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
