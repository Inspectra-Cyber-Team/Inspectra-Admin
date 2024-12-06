import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function CreateTab() {
  return (
    <form className="space-y-8 bg-card p-6">
      <h1 className="text-center font-bold text-2xl">Create Blog</h1>
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" placeholder="Enter blog post title" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea id="content" placeholder="Write your blog post content here" className="min-h-[200px]" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="image">Featured Image</Label>
        <Input id="image" type="file" />
      </div>
      <Button type="submit" className="justify-end">Create Post</Button>
    </form>
  )
}

