"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  FileText,
  Eye,
  Calendar,
  Minus,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PostDialog } from "@/components/admin/post-dialog";
import { Posts } from "../../../types/appwrite";
import {
  getPosts,
  getAuthorName,
  createPost,
  updatePost,
  deletePost,
} from "@/lib/actions/blog";
import { account } from "@/lib/appwrite/client";

// Define the form data interface (should match what's in post-dialog.tsx)
interface PostFormData {
  title: string;
  shortDescription: string;
  thumbnail: string;
  slug: string;
  draft: boolean;
  content: string;
}

export function PostsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Posts[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Posts | undefined>(undefined);
  const [authors, setAuthors] = useState<Record<string, string>>({});

  // Fetch posts using Server Action
  const fetchPosts = async () => {
    try {
      const { posts: postsData, error } = await getPosts();

      if (error) {
        console.error("Error fetching posts:", error);
        return;
      }

      setPosts(postsData);

      // Fetch author names for all posts
      const authorPromises = postsData.map(async (post) => {
        const name = await getAuthorName(post.userId);
        return { userId: post.userId, name };
      });

      const authorResults = await Promise.all(authorPromises);
      const authorsMap = authorResults.reduce((acc, { userId, name }) => {
        acc[userId] = name;
        return acc;
      }, {} as Record<string, string>);

      setAuthors(authorsMap);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      authors[post.userId]?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate stats
  const totalPosts = posts.length;
  const publishedPosts = posts.filter((post) => !post.draft).length;
  const draftPosts = posts.filter((post) => post.draft).length;
  const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0);

  const handleCreatePost = async (postData: PostFormData) => {
    const result = await createPost(postData, (await account.get()).$id);
    if (result.success) {
      await fetchPosts(); // Refresh the list
      setIsDialogOpen(false);
    } else {
      console.error("Error creating post:", result.error);
    }
  };

  const handleEditPost = async (postData: PostFormData) => {
    if (!editingPost) return;

    const result = await updatePost(editingPost.$id, postData, editingPost);
    if (result.success) {
      await fetchPosts(); // Refresh the list
      setEditingPost(undefined);
      setIsDialogOpen(false);
    } else {
      console.error("Error updating post:", result.error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    const result = await deletePost(postId);
    if (result.success) {
      setPosts(posts.filter((post) => post.$id !== postId));
    } else {
      console.error("Error deleting post:", result.error);
    }
  };

  const openEditDialog = (post: Posts) => {
    setEditingPost(post);
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingPost(undefined);
    setIsDialogOpen(true);
  };

  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Force redirect even if logout fails
      router.push("/auth/login");
    }
  };

  const getStatusBadge = (draft: boolean) => {
    const status = draft ? "draft" : "published";
    const colors = {
      published: "bg-green-500/10 text-green-500 border-green-500/20",
      draft: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    };
    return (
      <Badge className={colors[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Posts Management
            </h1>
            <p className="text-muted-foreground">
              Manage and organize your blog posts
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={openCreateDialog} className="gap-2">
              <Plus className="h-4 w-4" />
              Create New Post
            </Button>
            <Button
              onClick={handleLogout}
              className="gap-2 bg-red-600 hover:bg-red-700 text-white"
            >
              <Minus className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPosts}</div>
              <p className="text-xs text-muted-foreground">
                All posts in system
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{publishedPosts}</div>
              <p className="text-xs text-muted-foreground">Live posts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Drafts</CardTitle>
              <Edit className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{draftPosts}</div>
              <p className="text-xs text-muted-foreground">Unpublished posts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalViews.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">All time views</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            Showing {filteredPosts.length} of {totalPosts} posts
          </div>
        </div>

        {/* Posts Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="w-[100px]">Views</TableHead>
                  <TableHead className="w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.map((post) => (
                  <TableRow key={post.$id}>
                    <TableCell>
                      <div className="font-medium">{post.title}</div>
                      <div className="text-sm text-muted-foreground truncate max-w-[250px]">
                        {post.shortDescription}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                          {(authors[post.userId] || "U")
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        {authors[post.userId] || "Unknown"}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(post.draft)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {formatDate(post.$createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {post.updateDate ? (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {formatDate(post.updateDate)}
                        </div>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        {post.views || 0}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => openEditDialog(post)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeletePost(post.$id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <PostDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        post={editingPost}
        onSave={editingPost ? handleEditPost : handleCreatePost}
      />
    </div>
  );
}
