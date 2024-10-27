-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT,
    "name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "OAuthProvider" (
    "provider_id" SERIAL NOT NULL,
    "provider_name" TEXT NOT NULL,
    "auth_url" TEXT,
    "token_url" TEXT,
    "api_base_url" TEXT,

    CONSTRAINT "OAuthProvider_pkey" PRIMARY KEY ("provider_id")
);

-- CreateTable
CREATE TABLE "UserOAuthAccount" (
    "account_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "provider_id" INTEGER NOT NULL,
    "access_token" TEXT NOT NULL,
    "refresh_token" TEXT,
    "token_expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserOAuthAccount_pkey" PRIMARY KEY ("account_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "OAuthProvider_provider_name_key" ON "OAuthProvider"("provider_name");

-- CreateIndex
CREATE UNIQUE INDEX "UserOAuthAccount_user_id_provider_id_key" ON "UserOAuthAccount"("user_id", "provider_id");

-- AddForeignKey
ALTER TABLE "UserOAuthAccount" ADD CONSTRAINT "UserOAuthAccount_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOAuthAccount" ADD CONSTRAINT "UserOAuthAccount_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "OAuthProvider"("provider_id") ON DELETE RESTRICT ON UPDATE CASCADE;
