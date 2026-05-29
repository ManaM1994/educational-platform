"use client";

import { Card, List, Rate, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import type { Review } from "@/types";

export default function TutorReviewsTab({ reviews }: { reviews: Review[] }) {
  return (
    <Card title="بازخورد دانشجویان" className="rounded-2xl shadow-sm">
      <List
        itemLayout="horizontal"
        dataSource={reviews}
        locale={{ emptyText: "هنوز بازخوردی برای شما ثبت نشده است" }}
        renderItem={(review) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar icon={<UserOutlined />} />}
              title={
                <div className="flex items-center gap-2">
                  <span>
                    {review.student.user.first_name}{" "}
                    {review.student.user.last_name}
                  </span>
                  <Rate
                    disabled
                    defaultValue={review.rating}
                    className="text-sm"
                  />
                </div>
              }
              description={
                <div>
                  <p className="text-foreground">{review.review_text}</p>
                  <p className="text-muted text-xs mt-1">
                    {review.review_date}
                  </p>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
}
