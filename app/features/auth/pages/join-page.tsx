import { Link } from "react-router";
import { Button } from "~/common/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { Input } from "~/common/components/ui/input";
import { Label } from "~/common/components/ui/label";

export default function JoinPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <img
              src="https://thework.com/wp-content/uploads/2019/03/The-Work-app.jpg"
              alt="The Work"
              className="size-12 rounded"
            />
          </div>
          <CardTitle className="text-2xl">회원가입</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">이름</Label>
            <Input id="name" placeholder="홍길동" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input id="email" type="email" placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input id="password" type="password" />
          </div>
          <div className="space-y-2">
            <Label>역할 선택</Label>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" type="button">
                내담자
              </Button>
              <Button variant="outline" className="flex-1" type="button">
                상담사
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button className="w-full">가입하기</Button>
          <p className="text-sm text-muted-foreground">
            이미 계정이 있으신가요?{" "}
            <Link to="/auth/login" className="text-primary hover:underline">
              로그인
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
