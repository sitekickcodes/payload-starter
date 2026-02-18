"use client";

import { useAuth } from "@payloadcms/ui";

const getInitials = (name?: string | null, email?: string | null): string => {
  if (name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
  if (email) {
    return email.slice(0, 2).toUpperCase();
  }
  return "?";
};

const styles = {
  wrapper: {
    width: 24,
    height: 24,
    borderRadius: "50%",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e4e4e7",
    color: "#3f3f46",
    fontSize: 11,
    fontWeight: 600,
    lineHeight: 1,
    flexShrink: 0,
  } as const,
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  } as const,
};

const AdminAvatar = () => {
  const { user } = useAuth();
  const typedUser = user as {
    name?: string;
    avatar?: { url?: string; thumbnailURL?: string } | null;
  } | null;

  const avatarUrl = typedUser?.avatar?.url;

  return (
    <div style={styles.wrapper}>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={typedUser?.name || ""}
          style={styles.image}
        />
      ) : (
        getInitials(typedUser?.name, user?.email)
      )}
    </div>
  );
};

export default AdminAvatar;
